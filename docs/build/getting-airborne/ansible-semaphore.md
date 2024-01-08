---
sidebar_position: 3
---

# Ansible Semaphore
Time for some automation!

## What is Ansible Semaphore?
Ansible Semaphore is a web-based UI for Ansible. It allows you to run Ansible playbooks and jobs from a web interface, and provides a nice way to organize your playbooks and jobs.

## Installing Ansible Semaphore
We'll take the machine we built earlier, `robot01`, and set up Ansible Semaphore on it.

However, we won't do this manually. From now on, pretty much everything we do will be done with some form of automation. We'll use Ansible to install Ansible Semaphore.

Start by making a new host group called [semaphore] in your inventory file, and add robot01 to it.

```ini
---
...
[semaphore]
robot01
```

Make a new playbook, called ansible-semaphore-playbook.

`mkdir -p ~/projects/rifflab-infrastructure/playbooks/ansible-semaphore-playbook/roles`

*playbooks/ansible-semaphore-playbook/deploy.yml*
```yaml
---
- name: Install and configure Semaphore
  hosts: semaphore
  become: true

  roles:
    - geerlingguy.docker
    - ansible-semaphore
```

Create a requirements file for the role we'll be using:

```yaml
---
roles:
- name: geerlingguy.docker
  version: 7.0.2
```

Now create the main ansible-semaphore role:

`mkdir -p ~/projects/rifflab-infrastructure/playbooks/ansible-semaphore-playbook/roles/ansible-semaphore/tasks`

*playbooks/ansible-semaphore-playbook/roles/ansible-semaphore/tasks/main.yml*
```yaml
---
- name: Create Ansible Semaphore group
  group:
    name: semaphore
    state: present

- name: Create Ansible Semaphore user
  user:
    name: semaphore
    shell: /bin/bash
    home: /opt/semaphore
    createhome: yes

- name: Create Docker Compose file for Ansible Semaphore
  template:
    src: docker-compose.yml.j2
    dest: /opt/semaphore/docker-compose.yml
    owner: semaphore
    group: semaphore

- name: Bring up Ansible Semaphore using Docker Compose
  ansible.builtin.command:
    chdir: /opt/semaphore
    cmd: docker-compose up -d
    # TODO: Make this more idempotent
```

Create a templates folder in the roles/ansible-semaphore folder, and create a new file called docker-compose.yml.j2 inside it:
```bash
mkdir -p roles/ansible-semaphore/templates
editor roles/ansible-semaphore/templates/docker-compose.yml.j2
```

*playbooks/ansible-semaphore-playbook/roles/ansible-semaphore/templates/docker-compose.yml.j2*
```yaml
services:
  semaphore:
    restart: unless-stopped
    ports:
      - 3000:3000
    image: semaphoreui/semaphore:latest
    environment:
{% if semaphore_ldap_config is defined %}
      {{ semaphore_ldap_config }}
{% endif %}
{% if semaphore_database_config is defined %}
      {{ semaphore_database_config }}
{% else %}
      SEMAPHORE_DB_DIALECT: bolt
{% endif %}
      SEMAPHORE_ADMIN_PASSWORD: {{ semaphore_initial_password }}
      SEMAPHORE_ADMIN_NAME: {{ semaphore_admin_name }}
      SEMAPHORE_ADMIN_EMAIL: {{ semaphore_admin_email }}
      SEMAPHORE_ADMIN: {{ semaphore_admin_username }}
      SEMAPHORE_ACCESS_KEY_ENCRYPTION: {{ semaphore_encryption_secret_key }}
    volumes:
      - /opt/semaphore/data/etc:/etc/semaphore
{% if semaphore_database_config is not defined %}
      - /opt/semaphore/data/db:/var/lib/semaphore
{% endif %}```

We've defined a bunch of variables in the docker-compose.yml.j2 file. You've probably noticed by now that we're using Jinja2's "handlebars" syntax, `{{ variable_name }}` to reference variables and use them in our templates. We'll need a way of using these variables later, but we don't want to store them in "plaintext". This is where a tool called Ansible Vault comes in.

## Ansible Vault
Ansible Vault is a tool that allows you to encrypt sensitive data, such as passwords, API keys, and more. We'll use it to encrypt the variables we're using in our docker-compose.yml.j2 template.

We'll create a new Git repository called `rifflabs-secret`, and store our encrypted variables in there.

```bash
mkdir -p ~/projects/rifflabs-secret
cd ~/projects/rifflabs-secret
git init
```

Inside, we'll mirror our directory structure for the inventory we've been using so far. Then we'll do a little trick; we'll create a symlink for the `hosts` file in our `rifflabs-secret` repository, and point it to the `hosts` file in our `rifflabs-infrastructure` repository.

```bash
mkdir -p inventory/group_vars/ && cd inventory/
ln -s '../../rifflabs-infrastructure/inventory/hosts' hosts
cd ~/projects/rifflabs-secret
```
