"use strict";(self.webpackChunkrifflab_docs=self.webpackChunkrifflab_docs||[]).push([[269],{590:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>c,frontMatter:()=>i,metadata:()=>a,toc:()=>d});var o=s(5893),t=s(1151);const i={sidebar_position:2},r="Building the base playbook",a={id:"build/getting-airborne/building-the-base-playbook",title:"Building the base playbook",description:"\x3c!--",source:"@site/docs/build/getting-airborne/building-the-base-playbook.md",sourceDirName:"build/getting-airborne",slug:"/build/getting-airborne/building-the-base-playbook",permalink:"/docs/build/getting-airborne/building-the-base-playbook",draft:!1,unlisted:!1,editUrl:"https://github.com/riffcc/rifflabs/tree/main/packages/create-docusaurus/templates/shared/docs/build/getting-airborne/building-the-base-playbook.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"buildSidebar",previous:{title:"Robots",permalink:"/docs/build/getting-airborne/robots"},next:{title:"The Bootstrap",permalink:"/docs/build/getting-airborne/the-bootstrap"}},l={},d=[{value:"Testing the playbook",id:"testing-the-playbook",level:2},{value:"User roles",id:"user-roles",level:2},{value:"root-user role",id:"root-user-role",level:3},{value:"riff-user role",id:"riff-user-role",level:3},{value:"ntp role",id:"ntp-role",level:3},{value:"sshd role",id:"sshd-role",level:3},{value:"Applying the new base-playbook across our infrastructure",id:"applying-the-new-base-playbook-across-our-infrastructure",level:3}];function h(e){const n={admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"building-the-base-playbook",children:"Building the base playbook"}),"\n",(0,o.jsxs)(n.p,{children:["Let's start by building a playbook which will configure the ",(0,o.jsx)(n.code,{children:"robot01"})," machine. We'll start by configuring the DNS servers on the machine, so that it can resolve the names of other machines in the lab. You'll notice ",(0,o.jsx)(n.em,{children:"this"})," step is already done, as I had begun working on the base playbook prior to this documentation."]}),"\n",(0,o.jsx)(n.p,{children:"Let's test what it does!"}),"\n",(0,o.jsx)(n.h2,{id:"testing-the-playbook",children:"Testing the playbook"}),"\n",(0,o.jsxs)(n.p,{children:["We'll use the ",(0,o.jsx)(n.code,{children:"ansible-playbook"})," command to run the playbook. We'll use the ",(0,o.jsx)(n.code,{children:"-i"})," flag to specify the inventory file, and the ",(0,o.jsx)(n.code,{children:"-l"})," flag to specify the host we want to run the playbook on."]}),"\n",(0,o.jsx)(n.p,{children:"We'll look at the \"production\" inventory file, and we'll even take over it for now and replace it with our own, as that's actually an old inventory."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:'# Overwrite the hosts file with just robot01 as our target\necho "[maintenance]" > ~/projects/rifflabs-infrastructure/inventories/production/hosts\necho "robot01" >> ~/projects/rifflabs-infrastructure/inventories/production/hosts\nansible-playbook playbooks/base-playbook/deploy.yml -i ~/projects/rifflabs-infrastructure/inventories/production\n'})}),"\n",(0,o.jsx)(n.p,{children:'We\'ll be using the "production" inventory for a while, but eventually once we\'ve laid down the foundations for our automation infrastructure, we\'ll be using an "inventory plugin" to dynamically generate our inventory.'}),"\n",(0,o.jsx)(n.p,{children:"Let's take a look at the output of the playbook:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:'wings@blackberry:~/projects/rifflabs-infrastructure$ ansible-playbook playbooks/base-playbook/deploy.yml -i ~/projects/rifflabs-infrastructure/inventories/production\n\nPLAY [Apply basic configuration] *********************************************************************************************************************************************\n\nTASK [Gathering Facts] *******************************************************************************************************************************************************\nThe authenticity of host \'robot01 (10.1.2.2)\' can\'t be established.\nED25519 key fingerprint is SHA256:BYq10SIPCaq01O/K62eSM/66MN2fbFrcJcgQP19r+D0.\nThis key is not known by any other names.\nAre you sure you want to continue connecting (yes/no/[fingerprint])? yes\nfatal: [robot01]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh: hostkeys_find_by_key_hostfile: hostkeys_foreach failed for /etc/ssh/ssh_known_hosts: Permission denied\\r\\nWarning: Permanently added \'robot01\' (ED25519) to the list of known hosts.\\r\\nwings@robot01: Permission denied (publickey,password).", "unreachable": true}\n\nPLAY RECAP *******************************************************************************************************************************************************************\nrobot01                    : ok=0    changed=0    unreachable=1    failed=0    skipped=0    rescued=0    ignored=0   \n'})}),"\n",(0,o.jsxs)(n.p,{children:["Well, that initially didn't go well. That's because we'll connect using our own username by default if the playbook doesn't specify it - and it's usually best practice ",(0,o.jsx)(n.em,{children:"not"})," to specify a username in the playbook, as you'll want to be able to run the playbook as any user."]}),"\n",(0,o.jsx)(n.p,{children:"Let's try again, this time specifying the username:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:'wings@blackberry:~/projects/rifflabs-infrastructure$ ansible-playbook playbooks/base-playbook/deploy.yml -i ~/projects/rifflabs-infrastructure/inventories/production -u riff\n\nPLAY [Apply basic configuration] *********************************************************************************************************************************************\n\nTASK [Gathering Facts] *******************************************************************************************************************************************************\nfatal: [robot01]: FAILED! => {"msg": "Missing sudo password"}\n\nPLAY RECAP *******************************************************************************************************************************************************************\nrobot01                    : ok=0    changed=0    unreachable=0    failed=1    skipped=0    rescued=0    ignored=0   \n'})}),"\n",(0,o.jsx)(n.p,{children:"This time we got a little further, but we're still not quite there. We need to pass the --ask-become-pass flag to Ansible, so that it can ask us for the sudo password."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"wings@blackberry:~/projects/rifflabs-infrastructure$ ansible-playbook playbooks/base-playbook/deploy.yml -i ~/projects/rifflabs-infrastructure/inventories/production -u riff --ask-become-pass\nBECOME password: \n\nPLAY [Apply basic configuration] *********************************************************************************************************************************************\n\nTASK [Gathering Facts] *******************************************************************************************************************************************************\nok: [robot01]\n\nTASK [dns : Ensure systemd-resolved is installed] ****************************************************************************************************************************\nchanged: [robot01]\n\nTASK [dns : Ensure systemd-resolved is configured with the local DNS servers] ************************************************************************************************\nchanged: [robot01]\n\nRUNNING HANDLER [dns : Restart systemd-resolved] *****************************************************************************************************************************\nchanged: [robot01]\n\nPLAY RECAP *******************************************************************************************************************************************************************\nrobot01                    : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0\n"})}),"\n",(0,o.jsx)(n.p,{children:"Success! We've now run our first Ansible playbook. Let's take a look at what it did."}),"\n",(0,o.jsxs)(n.p,{children:["First, it installed the ",(0,o.jsx)(n.code,{children:"systemd-resolved"})," package for us. There are plenty of ways to handle DNS resolution on machines, but our chosen method is using systemd-resolved. Then, it configured systemd-resolved with the local DNS servers, and restarted the service."]}),"\n",(0,o.jsx)(n.p,{children:"Here's the resulting configuration file it edited (shortened for brevity):"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"riff@robot01:~$ sudo cat /etc/systemd/resolved.conf\n[sudo] password for riff: \n#  This file is part of systemd.\n[...]\n\n[Resolve]\n[...]\nDNS = 10.1.1.151\nDNS = 10.1.1.152\nDNS = 10.1.1.153\n[...]\n"})}),"\n",(0,o.jsxs)(n.p,{children:["It also knew to restart the systemd-resolved service, because of the ",(0,o.jsx)(n.code,{children:"notify:"})," directive we put in the task. This is a very common pattern in Ansible, and you'll see it a lot."]}),"\n",(0,o.jsxs)(n.p,{children:["You don't have to guess what Ansible changed, however - in future, get in the habit of running it with the ",(0,o.jsx)(n.code,{children:"--diff"})," flag to see what it has changed. You can also run it in combination with the ",(0,o.jsx)(n.code,{children:"--check"})," flag to see what it ",(0,o.jsx)(n.em,{children:"would have changed"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:["How did Ansible know to use those DNS servers? We set them in something called ",(0,o.jsx)(n.code,{children:"group_vars"})," - group variables. Let's take a look at them."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:'wings@blackberry:~/projects/rifflabs-infrastructure$ cat inventories/production/group_vars/all \n---\ndns_servers:\n  - "10.1.1.151"\n  - "10.1.1.152"\n  - "10.1.1.153"\n'})}),"\n",(0,o.jsxs)(n.p,{children:["This set a variable called ",(0,o.jsx)(n.code,{children:"dns_servers"})," to a list of IP addresses. We then used that variable in our playbook. This allows us to do cool things like change the DNS servers for all machines in the lab by changing one file, or change them for one specific set of machines by making an additional ",(0,o.jsx)(n.code,{children:"group_vars"}),' file that only applies to those machines and "overrides" this variable.']}),"\n",(0,o.jsx)(n.p,{children:"We'll proceed with setting up a few different things on robot01, and then we'll move on to setting up Ansible Semaphore."}),"\n",(0,o.jsx)(n.h2,{id:"user-roles",children:"User roles"}),"\n",(0,o.jsxs)(n.p,{children:["The first thing we'll do now that DNS is done is set up the user roles. We'll add two additional roles to ",(0,o.jsx)(n.code,{children:"deploy.yml"}),":"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"---\n- name: Apply basic configuration\n  hosts: all\n  become: true\n\n  roles:\n    - dns\n    - root-user\n    - riff-user\n"})}),"\n",(0,o.jsxs)(n.p,{children:["We'll also add the ",(0,o.jsx)(n.code,{children:"root-user"})," and ",(0,o.jsx)(n.code,{children:"riff-user"})," roles to the ",(0,o.jsx)(n.code,{children:"roles/"})," directory."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"cd ~/projects/rifflabs-infrastructure/playbooks/base-playbook\nmkdir -p roles/root-user/{tasks,templates,handlers}\nmkdir -p roles/riff-user/{tasks,templates,handlers}\ntouch roles/root-user/{tasks,handlers}/main.yml\ntouch roles/riff-user/{tasks,handlers}/main.yml\n"})}),"\n",(0,o.jsxs)(n.admonition,{type:"info",children:[(0,o.jsxs)(n.p,{children:["There are three tricks we just used that you should take note of. First is the use of the ",(0,o.jsx)(n.code,{children:"-p"})," flag when running mkdir - this allows you to create a directory but not return an error if the directory already exists."]}),(0,o.jsxs)(n.p,{children:["Second is the use of the ",(0,o.jsx)(n.code,{children:"{}"}),' syntax to create multiple directories at once. This is a bash feature, and it\'s very useful (and usually available in - or "portable to" - other shells such as ',(0,o.jsx)(n.code,{children:"zsh"}),")."]}),(0,o.jsxs)(n.p,{children:["Third is the use of ",(0,o.jsx)(n.code,{children:"touch"})," to create an empty file. This is a very common trick, as it allows you to create a file without having to open an editor."]}),(0,o.jsx)(n.p,{children:"With just four lines of bash, we've created two roles with the correct directory structure."})]}),"\n",(0,o.jsx)(n.h3,{id:"root-user-role",children:"root-user role"}),"\n",(0,o.jsxs)(n.p,{children:["Let's take a look at the ",(0,o.jsx)(n.code,{children:"root-user"})," role first. We'll start with the ",(0,o.jsx)(n.code,{children:"tasks/main.yml"})," file:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'---\n- name: Use the user module to get the information about the current user\n# TODO: make this dynamic instead of hardcoding the user\n  user:\n    name: "root"\n    state: present\n  register: user_details\n  check_mode: true\n\n- name: Ensure ~/.ssh directory exists\n  ansible.builtin.file:\n    path: "{{ user_details.home }}/.ssh"\n    state: directory\n    mode: \'0700\'\n    owner: "{{ user_details.name }}"\n    group: "{{ user_details.name }}"\n\n- name: Fetch keys from GitHub URLs and store in a variable\n  uri:\n    url: "{{ item }}"\n    return_content: yes\n  register: authorized_keys_content\n  with_items:\n    - https://github.com/zorlin.keys\n    - https://github.com/michatinkers.keys\n    - "{{ additional_keys | default (\'\') }}"\n\n- name: Join authorized_keys_content in memory\n  set_fact:\n    combined_keys: "{{ authorized_keys_content.results | map(attribute=\'content\') | select(\'string\') | reject(\'equalto\', \'\') | join(\'\\n\') }}"\n\n- name: Validate that there is at least 1 key in combined_keys\n  assert:\n    that:\n      - combined_keys is defined\n      - combined_keys | length > 0\n\n- name: Append additional_root_public_keys to combined_keys if defined and non-empty\n  set_fact:\n    combined_keys: "{{ combined_keys + \'\\n\' + (additional_root_public_keys | join(\'\\n\')) }}"\n  when: additional_root_public_keys is defined and additional_root_public_keys | length > 0\n\n- name: Write combined_keys to ~/.ssh/authorized_keys\n  ansible.builtin.copy:\n    dest: "{{ user_details.home }}/.ssh/authorized_keys"\n    content: "{{ combined_keys }}"\n    owner: "{{ user_details.name }}"\n    group: "{{ user_details.name }}"\n    mode: \'0600\'\n'})}),"\n",(0,o.jsx)(n.p,{children:"This looks fairly complicated (and uses some fairly funky Ansible logic), but essentially what this playbook does is:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Grabs the home directory of the root user"}),"\n",(0,o.jsxs)(n.li,{children:["Creates the ",(0,o.jsx)(n.code,{children:".ssh"})," directory in the root user's home directory"]}),"\n",(0,o.jsx)(n.li,{children:"Fetches the public keys of two users from GitHub"}),"\n",(0,o.jsx)(n.li,{children:"Joins the public keys together into a single variable"}),"\n",(0,o.jsx)(n.li,{children:"Asserts that there is at least one key in the variable"}),"\n",(0,o.jsx)(n.li,{children:"If any additional keys are specified, joins them to the variable"}),"\n",(0,o.jsxs)(n.li,{children:["Writes the variable to the ",(0,o.jsx)(n.code,{children:"authorized_keys"})," file, authorizing all those keys to access this user."]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"We'll practice using Ansible using simpler examples, but eventually you'll work up to using more complex tasks like this."}),"\n",(0,o.jsx)(n.p,{children:"At some point in the future, this key management step can be replaced with one that installs only \"emergency\" public keys, so that we can access each machine as root if we need to. For now, however, we'll allow logins from either of RiffLab's caretakers."}),"\n",(0,o.jsx)(n.h3,{id:"riff-user-role",children:"riff-user role"}),"\n",(0,o.jsxs)(n.p,{children:["The riff-user role will be extremely similar, to the point where we can essentially copy and paste the entire example from before, changing ",(0,o.jsx)(n.code,{children:"root"})," to ",(0,o.jsx)(n.code,{children:"riff"}),"."]}),"\n",(0,o.jsxs)(n.admonition,{type:"info",children:[(0,o.jsx)(n.p,{children:"This is an example of something called \"code smell\", where something feels a bit off. If we can just copy and paste the entire example, can't we combine the two roles into one? We'll likely do that in a future cleanup step."}),(0,o.jsx)(n.p,{children:"Watch out for code smell as you develop any sort of code, but especially automation code."})]}),"\n",(0,o.jsx)(n.p,{children:"We remove the additional_root_public_keys task from the riff-user role, as we don't want to allow additional keys to be added to the riff user at this stage."}),"\n",(0,o.jsx)(n.p,{children:"That completes the riff-user role. Let's move on to the next step."}),"\n",(0,o.jsx)(n.h3,{id:"ntp-role",children:"ntp role"}),"\n",(0,o.jsx)(n.p,{children:"Initially, we were going to make our own ntp role, as follows:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"---\n- name: Apply basic configuration\n  hosts: all\n  become: true\n\n  roles:\n    - dns\n    - root-user\n    - riff-user\n    - ntp\n"})}),"\n",(0,o.jsxs)(n.p,{children:["However, part of Ansible's power comes from the high quality community roles that are available. We'll use the ",(0,o.jsx)(n.code,{children:"geerlingguy.ntp"})," role instead, as it's a very high quality role that does exactly what we need."]}),"\n",(0,o.jsx)(n.p,{children:"We add the role to our playbook, and add some variables to group_vars/all to configure it:"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.em,{children:"playbooks/base-playbook/deploy.yml"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"---\n- name: Apply basic configuration\n  hosts: all\n  become: true\n\n  roles:\n    - dns\n    - root-user\n    - riff-user\n    - geerlingguy.ntp\n"})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.em,{children:"inventories/production/group_vars/all"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"---\n[...]\nntp_package: chrony\nntp_timezone: Australia/Perth\nntp_daemon: chrony\nntp_manage_config: true\nntp_config_file: /etc/chrony/chrony.conf\n"})}),"\n",(0,o.jsxs)(n.p,{children:["We also add ",(0,o.jsx)(n.code,{children:"geerlingguy.ntp"})," to the file ",(0,o.jsx)(n.code,{children:"roles/requirements.yml"})," - this will allow us to use Ansible Galaxy to install the role:"]}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.em,{children:"playbooks/base-playbook/roles/requirements.yml"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"---\nroles:\n- name: geerlingguy.ntp\n  version: 2.3.3\n"})}),"\n",(0,o.jsxs)(n.admonition,{type:"info",children:[(0,o.jsx)(n.p,{children:'You should always use a specific "tagged" version of a role, rather than something like "latest" or "main" where possible. This will ensure predictability, and will prevent your automation from breaking if a role author makes a breaking change.'}),(0,o.jsx)(n.p,{children:"However, you may want some automation to upgrade which versions of roles you use across your entire IaC codebase, to avoid using outdated roles. It's a tradeoff, and you'll need to decide what's best for your situation and improve it over time."})]}),"\n",(0,o.jsxs)(n.p,{children:["Install the new role with ",(0,o.jsx)(n.code,{children:"ansible-galaxy install -r playbooks/base-playbook/roles/requirements.yml"})," and then run the playbook again."]}),"\n",(0,o.jsx)(n.h3,{id:"sshd-role",children:"sshd role"}),"\n",(0,o.jsx)(n.p,{children:"We'll apply a small change to how the SSH server on each box works - we'll disable password authentication, and we'll disable root login."}),"\n",(0,o.jsx)(n.p,{children:"First, add some variables to group_vars/all:"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.em,{children:"inventories/production/group_vars/all"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"---\n[...]\ndisable_root_login: true\ndisable_password_authentication: true\n"})}),"\n",(0,o.jsx)(n.p,{children:"This will allow us to override the behaviour of the role as needed."}),"\n",(0,o.jsx)(n.p,{children:"Next, we'll add the role to our playbook:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"mkdir -p playbooks/base-playbook/roles/sshd/{tasks,handlers}\n"})}),"\n",(0,o.jsx)(n.p,{children:"And we create a basic role that will disable root login and password authentication:"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.em,{children:"playbooks/base-playbook/roles/sshd/tasks/main.yml"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'---\n- name: Edit sshd config\n  lineinfile:\n    path: /etc/ssh/sshd_config\n    regexp: \'^(#?\\s*)?{{ item.regexp }}\'\n    line: \'{{ item.line }}\'\n    state: present\n  with_items:\n    - line: "PermitRootLogin {{ permit_root_login }}"\n      regexp: "PermitRootLogin\\ "\n    - line: "PasswordAuthentication no"\n      regexp: "PasswordAuthentication\\ "\n    - line: "PermitEmptyPasswords no"\n      regexp: "PermitEmptyPasswords\\ "\n    - line: "StrictModes yes"\n      regexp: "StrictModes\\ "\n    - line: "PubkeyAuthentication yes"\n      regexp: "PubkeyAuthentication\\ "\n  notify: Restart sshd\n'})}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.em,{children:"playbooks/base-playbook/roles/sshd/handlers/main.yml"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"---\n- name: Restart sshd\n  service:\n    name: sshd\n    state: restarted\n"})}),"\n",(0,o.jsxs)(n.admonition,{type:"warning",children:[(0,o.jsx)(n.p,{children:'Make sure you have a way "back in" whenever making any changes to SSH, PAM, Sudo or anything else that might prevent you from being able to undo the changes you\'re making!'}),(0,o.jsx)(n.p,{children:"This can be as simple as having a root password set, or having a user with sudo access that you can log in as. Don't get locked out!"}),(0,o.jsxs)(n.p,{children:["Also, when editing anything to do with ",(0,o.jsx)(n.code,{children:"sudo"}),", ",(0,o.jsx)(n.em,{children:"ALWAYS"})," use the utility ",(0,o.jsx)(n.code,{children:"visudo"})," - it will often save you."]})]}),"\n",(0,o.jsxs)(n.p,{children:["Run the playbook to test it, using ",(0,o.jsx)(n.code,{children:"--check --diff"})," if you're not 100% sure what it will do yet."]}),"\n",(0,o.jsx)(n.p,{children:"Examine everything carefully. Once you're ready, we'll apply this playbook to everything we've built so far."}),"\n",(0,o.jsx)(n.h3,{id:"applying-the-new-base-playbook-across-our-infrastructure",children:"Applying the new base-playbook across our infrastructure"}),"\n",(0,o.jsxs)(n.p,{children:["We may as well roll this out to our Proxmox hosts as a test. We'll add the ",(0,o.jsx)(n.code,{children:"proxmox"})," group to our inventory, and then we'll run the playbook against that group. While we're at it, I'll show you a few tricks that will be handy - especially applying specific variables to groups of hosts."]}),"\n",(0,o.jsx)(n.p,{children:"First, we edit our inventory file to include our Proxmox hosts:"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.em,{children:"inventories/production/hosts"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"[maintenance]\nrobot01\n\n[proxmox:children]\nproxmox_wingslab\n\n[proxmox_wingslab]\nmonstar.riff.cc ansible_user=root\nal.riff.cc ansible_user=root\nambellina.riff.cc ansible_user=root\ninferno.riff.cc ansible_user=root\n"})}),"\n",(0,o.jsxs)(n.p,{children:["You'll note we didn't define the ",(0,o.jsx)(n.code,{children:"[proxmox]"})," inventory group directly - instead, we defined a ",(0,o.jsx)(n.code,{children:"[proxmox:children]"})," group, and then defined a ",(0,o.jsx)(n.code,{children:"[proxmox_wingslab]"})," group. This allows us to define a group of hosts that are children of another group - in other words, we can define proxmox_wingslab and then set that group to be included in the general proxmox inventory group."]}),"\n",(0,o.jsx)(n.p,{children:"Now, let's set some group_vars specifically for that group."}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.em,{children:"inventories/production/group_vars/proxmox_wingslab"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'---\npermit_root_login: "prohibit-password"\n\nadditional_root_public_keys:\n    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDYjoGmIZdLLYuPPjzuP8HpyGxYW4yaxpKlF8B4Z9mTT8BZvFv7nnxvtK70CIdUPXbewzweBR/LwaBAFi2AoXdavCmQE2u8upIAWQgmSLZ4tvNYkBzEv/Z2w90iJ7ZFruv7OqkjGaZAd4f7A1U6wShd/AcaKrA44m+Qr9nikRGlAPV/Zr2wxJJaivtA2lzsj4gV640bvhZ6QonY1w5FeZrO0ORq4wahP7bepHdLkznVVHiwgtFV/vI5qVfEp7R5zoAtzsiX/eEbCDdoqTNycdDZ6fklHF7zx7xYelV4dXxBIiaBcSYvIJ9xTqtVg2aVJ8M5YbBwsqGEYOCxoxh+vNAR root@inferno\n    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDLcsNFQDzv796ULOpcuhoitZQnv3Wx1zb9qKxMjQoqE74A953afghdnfZm7cjnGPqnhRaHNr97l/ccdBRqyKo3jvHYN7wNyG8GxN5gRqhLqD00MumKL2eN79oilxLBEPt4eSL8CyukMG4WtCNQcZ+SHVoRvTjoxN6GafGbnVl36T3b9QgxxWR7dAqbs0cByGRZMdMYnpA2+eWUJ45p5Rzd9cRFHNnpFqb+K/n78J906D7TpXq6lck8Ya4bpBSHs8Np7DEfSeK15ROuGZsT69JnMZlKBCnCpjGG4Bl+d/IfeRZg9/hBkrZomsRwM61+8qD4/juDeKTb/ecyBYK7c7Gz root@sizer\n    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCyYvndhIfnHd5bwgKQNq6DpGG/fd3XzClKVLTTYPeOF4ZZzUTyETtJliNCmIg0NlZVdAeoteQ1A78NgzY4F/8VDj58ZRqE4hIsazny8/ay0oYmXobU6Kwzx5lh9TgQJ3MQUAdZ21zxkZ9xxWM1YvQOX5LA2f4omE02MpSas1Du2UU9y9EToD5Pgu8ms5uxqJGRTGurJmPBJrampaXNHK6caGWm206j+l9Cuq/MU66flCXxQyR5MMKftKJkoumT9Rqz7Yn7b0s/jHX1du0mfRSA67eknWWTYVwIkLHlUBBWvJxPVfvQT/ANxAecRCmBGIzMCxj+tXs0p8TjnOphH5O3 root@al\n    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCv62d4BofqCVYrRZOfNoXhDMUwwzcvPzRTTDGHxtyMPz6E5mRs3lUgeEHvxkt979QqdhSNXNgZA21JjCWhhyi/XbECwRslfFar5Hv9ElJNiugG0PrOnKT36U3i/b7ojnnFa/qVXm++G8/D5WvLRmC2Ts5VEWpO0HsDtTZQptTiy8sUEPmDUTNLBa9JTh+X5klkkWTirWwyvY1McFbtLqSl0qmpdV0sh/CxrJD2U2KoEFYgLODL2QekExrypMpTrq9tGRNGCud30kUWFagWqVSxtM9CJyDKN/HBOZXV/cVfSh29TyMrcBIlmiz07kPmWIyAz+sBpXB6T+e6W8Ho2Px9 root@ambellina\n    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDKb6KOxFz5Vg4iZeWMKUnyLM+AzuhPg4/c5s8X+E3AyuPzoF2jhP36Z5iwlHwVUGrbwGDBI62iKq7KgNusG3X6+mfRm3JKANFqrF07m+fnoSBwHcVRluY8u9b+r73IWeNslrtyraSpRXxN9LiCtNWxoZbkzZFWZHPZNTiNGrMX5cELsxro5phD+KIiqXIdhql4Z1WR0mNXWVKUNguBZHU74WeUpARxCv/RTjKFkRJHOPjVSEKtoWz9rltT3p65guxKMyp941kcMLZii5izxUUayYlkKblyNH4XOuwoXPkdQiY+fOO45l4PDwyfivVt6u9LAY+Pb3C63va7q5/+X7/r root@monstar\n'})}),"\n",(0,o.jsx)(n.p,{children:'Note that we\'ve defined additional root keys for each of the machines within our cluster, and we\'ve also set PermitRootLogin to "prohibit-password" instead of "no". This will allow us to log in as root using SSH keys, but not using a password. This is actually critical for Proxmox to operate, as many things ranging from live migrating VMs to visiting VM consoles require Proxmox hosts to be able to SSH to each other as root.'}),"\n",(0,o.jsx)(n.p,{children:"We'll be very careful with this rollout - we'll combine the --check and --diff flags to see what Ansible would do, and only after reviewing the changes will we let them be applied to the Proxmox hosts."}),"\n",(0,o.jsx)(n.p,{children:"Let's run the playbook with the --check and --diff flags:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"wings@blackberry:~/projects/rifflabs-infrastructure$ ansible-playbook playbooks/base-playbook/deploy.yml -i ~/projects/rifflabs-infrastructure/inventories/production -u riff --ask-become-pass --check --diff\n"})}),"\n",(0,o.jsx)(n.p,{children:"Finally, let's run it with the --diff flag to see what changes it makes while actually applying the changes."}),"\n",(0,o.jsx)(n.p,{children:"Congratulations, you now have a basic playbook that can be applied to your infrastructure. You can add additional roles to this over time and apply them to your whole infrastructure in minutes."}),"\n",(0,o.jsx)(n.p,{children:"Next, we'll look at setting up Ansible Semaphore to provide a central place to run Ansible playbooks and see the status of our automation."}),"\n",(0,o.jsx)(n.admonition,{type:"info",children:(0,o.jsx)(n.p,{children:"That got into the weeds a bit! Normally, Ansible is much easier and more approachable than that, but we're having to do some complex things with it - which requires some complex Ansible code."})})]})}function c(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},1151:(e,n,s)=>{s.d(n,{Z:()=>a,a:()=>r});var o=s(7294);const t={},i=o.createContext(t);function r(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),o.createElement(i.Provider,{value:n},e.children)}}}]);