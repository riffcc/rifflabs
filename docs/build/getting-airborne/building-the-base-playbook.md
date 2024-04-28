---
sidebar_position: 2
---

# Building the base playbook

<!-- 
  This will one day be replaced entirely by a "running the base playbook" tutorial.
  The new tutorial will simply involve running a base playbook that
    * Starts with a single machine, robot01
    * Installs Ansible on robot01
    * Uses Ansible on robot01 to configure robot01, set up Ansible, and set up Tinkerbell
    * Uses Tinkerbell to provision a Kubernetes cluster
    * Uses Ansible to configure the Kubernetes cluster
-->

Let's start by building a playbook which will configure the `robot01` machine. We'll start by configuring the DNS servers on the machine, so that it can resolve the names of other machines in the lab. You'll notice *this* step is already done, as I had begun working on the base playbook prior to this documentation.

Let's test what it does!

## Testing the playbook

We'll use the `ansible-playbook` command to run the playbook. We'll use the `-i` flag to specify the inventory file, and the `-l` flag to specify the host we want to run the playbook on.

We'll look at the "production" inventory file, and we'll even take over it for now and replace it with our own, as that's actually an old inventory.

```bash
# Overwrite the hosts file with just robot01 as our target
echo "[maintenance]" > ~/projects/rifflabs-infrastructure/inventories/production/hosts
echo "robot01" >> ~/projects/rifflabs-infrastructure/inventories/production/hosts
ansible-playbook playbooks/base-playbook/deploy.yml -i ~/projects/rifflabs-infrastructure/inventories/production
```

We'll be using the "production" inventory for a while, but eventually once we've laid down the foundations for our automation infrastructure, we'll be using an "inventory plugin" to dynamically generate our inventory.

Let's take a look at the output of the playbook:

```bash
wings@blackberry:~/projects/rifflabs-infrastructure$ ansible-playbook playbooks/base-playbook/deploy.yml -i ~/projects/rifflabs-infrastructure/inventories/production

PLAY [Apply basic configuration] *********************************************************************************************************************************************

TASK [Gathering Facts] *******************************************************************************************************************************************************
The authenticity of host 'robot01 (10.1.2.2)' can't be established.
ED25519 key fingerprint is SHA256:BYq10SIPCaq01O/K62eSM/66MN2fbFrcJcgQP19r+D0.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
fatal: [robot01]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh: hostkeys_find_by_key_hostfile: hostkeys_foreach failed for /etc/ssh/ssh_known_hosts: Permission denied\r\nWarning: Permanently added 'robot01' (ED25519) to the list of known hosts.\r\nwings@robot01: Permission denied (publickey,password).", "unreachable": true}

PLAY RECAP *******************************************************************************************************************************************************************
robot01                    : ok=0    changed=0    unreachable=1    failed=0    skipped=0    rescued=0    ignored=0   
```

Well, that initially didn't go well. That's because we'll connect using our own username by default if the playbook doesn't specify it - and it's usually best practice *not* to specify a username in the playbook, as you'll want to be able to run the playbook as any user.

Let's try again, this time specifying the username:

```bash
wings@blackberry:~/projects/rifflabs-infrastructure$ ansible-playbook playbooks/base-playbook/deploy.yml -i ~/projects/rifflabs-infrastructure/inventories/production -u riff

PLAY [Apply basic configuration] *********************************************************************************************************************************************

TASK [Gathering Facts] *******************************************************************************************************************************************************
fatal: [robot01]: FAILED! => {"msg": "Missing sudo password"}

PLAY RECAP *******************************************************************************************************************************************************************
robot01                    : ok=0    changed=0    unreachable=0    failed=1    skipped=0    rescued=0    ignored=0   
```

This time we got a little further, but we're still not quite there. We need to pass the --ask-become-pass flag to Ansible, so that it can ask us for the sudo password.

```bash
wings@blackberry:~/projects/rifflabs-infrastructure$ ansible-playbook playbooks/base-playbook/deploy.yml -i ~/projects/rifflabs-infrastructure/inventories/production -u riff --ask-become-pass
BECOME password: 

PLAY [Apply basic configuration] *********************************************************************************************************************************************

TASK [Gathering Facts] *******************************************************************************************************************************************************
ok: [robot01]

TASK [dns : Ensure systemd-resolved is installed] ****************************************************************************************************************************
changed: [robot01]

TASK [dns : Ensure systemd-resolved is configured with the local DNS servers] ************************************************************************************************
changed: [robot01]

RUNNING HANDLER [dns : Restart systemd-resolved] *****************************************************************************************************************************
changed: [robot01]

PLAY RECAP *******************************************************************************************************************************************************************
robot01                    : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

Success! We've now run our first Ansible playbook. Let's take a look at what it did.

First, it installed the `systemd-resolved` package for us. There are plenty of ways to handle DNS resolution on machines, but our chosen method is using systemd-resolved. Then, it configured systemd-resolved with the local DNS servers, and restarted the service.

Here's the resulting configuration file it edited (shortened for brevity):

```
riff@robot01:~$ sudo cat /etc/systemd/resolved.conf
[sudo] password for riff: 
#  This file is part of systemd.
[...]

[Resolve]
[...]
DNS = 10.1.1.151
DNS = 10.1.1.152
DNS = 10.1.1.153
[...]
```

It also knew to restart the systemd-resolved service, because of the `notify:` directive we put in the task. This is a very common pattern in Ansible, and you'll see it a lot.

You don't have to guess what Ansible changed, however - in future, get in the habit of running it with the `--diff` flag to see what it has changed. You can also run it in combination with the `--check` flag to see what it *would have changed*.

How did Ansible know to use those DNS servers? We set them in something called `group_vars` - group variables. Let's take a look at them.

```bash
wings@blackberry:~/projects/rifflabs-infrastructure$ cat inventories/production/group_vars/all 
---
dns_servers:
  - "10.1.1.151"
  - "10.1.1.152"
  - "10.1.1.153"
```

This set a variable called `dns_servers` to a list of IP addresses. We then used that variable in our playbook. This allows us to do cool things like change the DNS servers for all machines in the lab by changing one file, or change them for one specific set of machines by making an additional `group_vars` file that only applies to those machines and "overrides" this variable.

We'll proceed with setting up a few different things on robot01, and then we'll move on to setting up Ansible Semaphore.

## User roles
The first thing we'll do now that DNS is done is set up the user roles. We'll add two additional roles to `deploy.yml`:

```
---
- name: Apply basic configuration
  hosts: all
  become: true

  roles:
    - dns
    - root-user
    - riff-user
```

We'll also add the `root-user` and `riff-user` roles to the `roles/` directory.

```bash
cd ~/projects/rifflabs-infrastructure/playbooks/base-playbook
mkdir -p roles/root-user/{tasks,templates,handlers}
mkdir -p roles/riff-user/{tasks,templates,handlers}
touch roles/root-user/{tasks,handlers}/main.yml
touch roles/riff-user/{tasks,handlers}/main.yml
```

:::info

There are three tricks we just used that you should take note of. First is the use of the `-p` flag when running mkdir - this allows you to create a directory but not return an error if the directory already exists.

Second is the use of the `{}` syntax to create multiple directories at once. This is a bash feature, and it's very useful (and usually available in - or "portable to" - other shells such as `zsh`).

Third is the use of `touch` to create an empty file. This is a very common trick, as it allows you to create a file without having to open an editor.

With just four lines of bash, we've created two roles with the correct directory structure.

:::

### root-user role
Let's take a look at the `root-user` role first. We'll start with the `tasks/main.yml` file:

```yaml
---
- name: Use the user module to get the information about the current user
# TODO: make this dynamic instead of hardcoding the user
  user:
    name: "root"
    state: present
  register: user_details
  check_mode: true

- name: Ensure ~/.ssh directory exists
  ansible.builtin.file:
    path: "{{ user_details.home }}/.ssh"
    state: directory
    mode: '0700'
    owner: "{{ user_details.name }}"
    group: "{{ user_details.name }}"

- name: Fetch keys from GitHub URLs and store in a variable
  uri:
    url: "{{ item }}"
    return_content: yes
  register: authorized_keys_content
  with_items:
    - https://github.com/zorlin.keys
    - https://github.com/michatinkers.keys
    - "{{ additional_keys | default ('') }}"

- name: Join authorized_keys_content in memory
  set_fact:
    combined_keys: "{{ authorized_keys_content.results | map(attribute='content') | select('string') | reject('equalto', '') | join('\n') }}"

- name: Validate that there is at least 1 key in combined_keys
  assert:
    that:
      - combined_keys is defined
      - combined_keys | length > 0

- name: Append additional_root_public_keys to combined_keys if defined and non-empty
  set_fact:
    combined_keys: "{{ combined_keys + '\n' + (additional_root_public_keys | join('\n')) }}"
  when: additional_root_public_keys is defined and additional_root_public_keys | length > 0

- name: Write combined_keys to ~/.ssh/authorized_keys
  ansible.builtin.copy:
    dest: "{{ user_details.home }}/.ssh/authorized_keys"
    content: "{{ combined_keys }}"
    owner: "{{ user_details.name }}"
    group: "{{ user_details.name }}"
    mode: '0600'
```

This looks fairly complicated (and uses some fairly funky Ansible logic), but essentially what this playbook does is:

* Grabs the home directory of the root user
* Creates the `.ssh` directory in the root user's home directory
* Fetches the public keys of two users from GitHub
* Joins the public keys together into a single variable
* Asserts that there is at least one key in the variable
* If any additional keys are specified, joins them to the variable
* Writes the variable to the `authorized_keys` file, authorizing all those keys to access this user.

We'll practice using Ansible using simpler examples, but eventually you'll work up to using more complex tasks like this.

At some point in the future, this key management step can be replaced with one that installs only "emergency" public keys, so that we can access each machine as root if we need to. For now, however, we'll allow logins from either of RiffLab's caretakers.

### riff-user role
The riff-user role will be extremely similar, to the point where we can essentially copy and paste the entire example from before, changing `root` to `riff`.

:::info

This is an example of something called "code smell", where something feels a bit off. If we can just copy and paste the entire example, can't we combine the two roles into one? We'll likely do that in a future cleanup step.

Watch out for code smell as you develop any sort of code, but especially automation code.

:::

We remove the additional_root_public_keys task from the riff-user role, as we don't want to allow additional keys to be added to the riff user at this stage.

That completes the riff-user role. Let's move on to the next step.

### ntp role
Initially, we were going to make our own ntp role, as follows:

```yaml
---
- name: Apply basic configuration
  hosts: all
  become: true

  roles:
    - dns
    - root-user
    - riff-user
    - ntp
```

However, part of Ansible's power comes from the high quality community roles that are available. We'll use the `geerlingguy.ntp` role instead, as it's a very high quality role that does exactly what we need.

We add the role to our playbook, and add some variables to group_vars/all to configure it:

*playbooks/base-playbook/deploy.yml*
```yaml
---
- name: Apply basic configuration
  hosts: all
  become: true

  roles:
    - dns
    - root-user
    - riff-user
    - geerlingguy.ntp
```

*inventories/production/group_vars/all*
```yaml
---
[...]
ntp_package: chrony
ntp_timezone: Australia/Perth
ntp_daemon: chrony
ntp_manage_config: true
ntp_config_file: /etc/chrony/chrony.conf
```

We also add `geerlingguy.ntp` to the file `roles/requirements.yml` - this will allow us to use Ansible Galaxy to install the role:

*playbooks/base-playbook/roles/requirements.yml*
```yaml
---
roles:
- name: geerlingguy.ntp
  version: 2.3.3
```

:::info

You should always use a specific "tagged" version of a role, rather than something like "latest" or "main" where possible. This will ensure predictability, and will prevent your automation from breaking if a role author makes a breaking change.

However, you may want some automation to upgrade which versions of roles you use across your entire IaC codebase, to avoid using outdated roles. It's a tradeoff, and you'll need to decide what's best for your situation and improve it over time.

:::

Install the new role with `ansible-galaxy install -r playbooks/base-playbook/roles/requirements.yml` and then run the playbook again.

### sshd role
We'll apply a small change to how the SSH server on each box works - we'll disable password authentication, and we'll disable root login.

First, add some variables to group_vars/all:

*inventories/production/group_vars/all*
```yaml
---
[...]
disable_root_login: true
disable_password_authentication: true
```

This will allow us to override the behaviour of the role as needed.

Next, we'll add the role to our playbook:

```
mkdir -p playbooks/base-playbook/roles/sshd/{tasks,handlers}
```

And we create a basic role that will disable root login and password authentication:

*playbooks/base-playbook/roles/sshd/tasks/main.yml*
```yaml
---
- name: Edit sshd config
  lineinfile:
    path: /etc/ssh/sshd_config
    regexp: '^(#?\s*)?{{ item.regexp }}'
    line: '{{ item.line }}'
    state: present
  with_items:
    - line: "PermitRootLogin {{ permit_root_login }}"
      regexp: "PermitRootLogin\ "
    - line: "PasswordAuthentication no"
      regexp: "PasswordAuthentication\ "
    - line: "PermitEmptyPasswords no"
      regexp: "PermitEmptyPasswords\ "
    - line: "StrictModes yes"
      regexp: "StrictModes\ "
    - line: "PubkeyAuthentication yes"
      regexp: "PubkeyAuthentication\ "
  notify: Restart sshd
```

*playbooks/base-playbook/roles/sshd/handlers/main.yml*
```yaml
---
- name: Restart sshd
  service:
    name: sshd
    state: restarted
```

:::warning

Make sure you have a way "back in" whenever making any changes to SSH, PAM, Sudo or anything else that might prevent you from being able to undo the changes you're making!

This can be as simple as having a root password set, or having a user with sudo access that you can log in as. Don't get locked out!

Also, when editing anything to do with `sudo`, *ALWAYS* use the utility `visudo` - it will often save you.

:::

Run the playbook to test it, using `--check --diff` if you're not 100% sure what it will do yet.

Examine everything carefully. Once you're ready, we'll apply this playbook to everything we've built so far.

### Applying the new base-playbook across our infrastructure

We may as well roll this out to our Proxmox hosts as a test. We'll add the `proxmox` group to our inventory, and then we'll run the playbook against that group. While we're at it, I'll show you a few tricks that will be handy - especially applying specific variables to groups of hosts.

First, we edit our inventory file to include our Proxmox hosts:

*inventories/production/hosts*
```bash
[maintenance]
robot01

[proxmox:children]
proxmox_wingslab

[proxmox_wingslab]
monstar.riff.cc ansible_user=root
al.riff.cc ansible_user=root
ambellina.riff.cc ansible_user=root
inferno.riff.cc ansible_user=root
```

You'll note we didn't define the `[proxmox]` inventory group directly - instead, we defined a `[proxmox:children]` group, and then defined a `[proxmox_wingslab]` group. This allows us to define a group of hosts that are children of another group - in other words, we can define proxmox_wingslab and then set that group to be included in the general proxmox inventory group.

Now, let's set some group_vars specifically for that group.

*inventories/production/group_vars/proxmox_wingslab*
```yaml
---
permit_root_login: "prohibit-password"

additional_root_public_keys:
    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDYjoGmIZdLLYuPPjzuP8HpyGxYW4yaxpKlF8B4Z9mTT8BZvFv7nnxvtK70CIdUPXbewzweBR/LwaBAFi2AoXdavCmQE2u8upIAWQgmSLZ4tvNYkBzEv/Z2w90iJ7ZFruv7OqkjGaZAd4f7A1U6wShd/AcaKrA44m+Qr9nikRGlAPV/Zr2wxJJaivtA2lzsj4gV640bvhZ6QonY1w5FeZrO0ORq4wahP7bepHdLkznVVHiwgtFV/vI5qVfEp7R5zoAtzsiX/eEbCDdoqTNycdDZ6fklHF7zx7xYelV4dXxBIiaBcSYvIJ9xTqtVg2aVJ8M5YbBwsqGEYOCxoxh+vNAR root@inferno
    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDLcsNFQDzv796ULOpcuhoitZQnv3Wx1zb9qKxMjQoqE74A953afghdnfZm7cjnGPqnhRaHNr97l/ccdBRqyKo3jvHYN7wNyG8GxN5gRqhLqD00MumKL2eN79oilxLBEPt4eSL8CyukMG4WtCNQcZ+SHVoRvTjoxN6GafGbnVl36T3b9QgxxWR7dAqbs0cByGRZMdMYnpA2+eWUJ45p5Rzd9cRFHNnpFqb+K/n78J906D7TpXq6lck8Ya4bpBSHs8Np7DEfSeK15ROuGZsT69JnMZlKBCnCpjGG4Bl+d/IfeRZg9/hBkrZomsRwM61+8qD4/juDeKTb/ecyBYK7c7Gz root@sizer
    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCyYvndhIfnHd5bwgKQNq6DpGG/fd3XzClKVLTTYPeOF4ZZzUTyETtJliNCmIg0NlZVdAeoteQ1A78NgzY4F/8VDj58ZRqE4hIsazny8/ay0oYmXobU6Kwzx5lh9TgQJ3MQUAdZ21zxkZ9xxWM1YvQOX5LA2f4omE02MpSas1Du2UU9y9EToD5Pgu8ms5uxqJGRTGurJmPBJrampaXNHK6caGWm206j+l9Cuq/MU66flCXxQyR5MMKftKJkoumT9Rqz7Yn7b0s/jHX1du0mfRSA67eknWWTYVwIkLHlUBBWvJxPVfvQT/ANxAecRCmBGIzMCxj+tXs0p8TjnOphH5O3 root@al
    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCv62d4BofqCVYrRZOfNoXhDMUwwzcvPzRTTDGHxtyMPz6E5mRs3lUgeEHvxkt979QqdhSNXNgZA21JjCWhhyi/XbECwRslfFar5Hv9ElJNiugG0PrOnKT36U3i/b7ojnnFa/qVXm++G8/D5WvLRmC2Ts5VEWpO0HsDtTZQptTiy8sUEPmDUTNLBa9JTh+X5klkkWTirWwyvY1McFbtLqSl0qmpdV0sh/CxrJD2U2KoEFYgLODL2QekExrypMpTrq9tGRNGCud30kUWFagWqVSxtM9CJyDKN/HBOZXV/cVfSh29TyMrcBIlmiz07kPmWIyAz+sBpXB6T+e6W8Ho2Px9 root@ambellina
    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDKb6KOxFz5Vg4iZeWMKUnyLM+AzuhPg4/c5s8X+E3AyuPzoF2jhP36Z5iwlHwVUGrbwGDBI62iKq7KgNusG3X6+mfRm3JKANFqrF07m+fnoSBwHcVRluY8u9b+r73IWeNslrtyraSpRXxN9LiCtNWxoZbkzZFWZHPZNTiNGrMX5cELsxro5phD+KIiqXIdhql4Z1WR0mNXWVKUNguBZHU74WeUpARxCv/RTjKFkRJHOPjVSEKtoWz9rltT3p65guxKMyp941kcMLZii5izxUUayYlkKblyNH4XOuwoXPkdQiY+fOO45l4PDwyfivVt6u9LAY+Pb3C63va7q5/+X7/r root@monstar
```

Note that we've defined additional root keys for each of the machines within our cluster, and we've also set PermitRootLogin to "prohibit-password" instead of "no". This will allow us to log in as root using SSH keys, but not using a password. This is actually critical for Proxmox to operate, as many things ranging from live migrating VMs to visiting VM consoles require Proxmox hosts to be able to SSH to each other as root.

We'll be very careful with this rollout - we'll combine the --check and --diff flags to see what Ansible would do, and only after reviewing the changes will we let them be applied to the Proxmox hosts.

Let's run the playbook with the --check and --diff flags:

```bash
wings@blackberry:~/projects/rifflabs-infrastructure$ ansible-playbook playbooks/base-playbook/deploy.yml -i ~/projects/rifflabs-infrastructure/inventories/production -u riff --ask-become-pass --check --diff
```

Finally, let's run it with the --diff flag to see what changes it makes while actually applying the changes.

Congratulations, you now have a basic playbook that can be applied to your infrastructure. You can add additional roles to this over time and apply them to your whole infrastructure in minutes.

Next, we'll look at setting up Ansible Semaphore to provide a central place to run Ansible playbooks and see the status of our automation.

:::info

That got into the weeds a bit! Normally, Ansible is much easier and more approachable than that, but we're having to do some complex things with it - which requires some complex Ansible code.

:::