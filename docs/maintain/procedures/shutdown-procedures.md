---
sidebar_position: 1
---

# Shutdown procedures

The goal of shutting down Riff.CC labs, for whatever reason the shutdown is happening, is to turn off all the equipment as gracefully as possible, in a way that should ensure the greatest chance of later being able to turn it all back on again.

## Getting started
* Gather a rough idea of the state of the lab. Potentially take a quick photo and make a note of the event.
* If anything is messy or out of place, clean it up before you get started.

## Shutdown the MooseFS filesystem
* Turn off Jellyfin on Creature.
    * SSH to creature as root and run `systemctl stop jellyfin`
* Begin by turning off the moosefs-pro-master service on the MooseFS master node. This will prevent any new data from being written to the MooseFS filesystem.
    * This will currently by achievable via ssh root@10.1.1.154, then running `systemctl stop moosefs-pro-master`
* (TODO): Then go to each host and run `umount /mnt/mfs` to unmount the MooseFS filesystem from each host. This would be more safe than just turning hosts off, but we aren't actually going to do this just yet. Ignore this step. Will be an Ansible playbook in the future, which we can run to unmount MooseFS everywhere.
* Turn off all MooseFS chunkservers.
    * Currently these are the following hosts:
        * 10.1.1.154 - monstar - SSDs and HDDs
        * 10.1.1.155 - al - HDDs
        * 10.1.1.156 - ambellina - SSDs and HDDs
    * SSH to each host as root and run `systemctl stop moosefs-pro-chunkserver`

## Shutdown Kubernetes
* Shut down the Kubernetes workers. Run `systemctl stop rke2-agent` on each of the Kubernetes workers:
    * 10.1.1.154
    * 10.1.1.155
    * 10.1.1.156
* Shut down the Kubernetes masters. In CoreSVC Proxmox (https://coresvc.riff.cc:8006) right click the following VMs and click "Stop":
    * emerald-k8s-m01
    * emerald-k8s-m02
    * emerald-k8s-m03

## Shutdown the Farmer
Log onto the Farmer (`ssh root@monstar.riff.cc`) and run `screen -r plotter` and hit Ctrl-C to stop the plotter/farmer.

## Shutdown all major nodes
* Turn off al, ambellina, monstar, inferno, sizer
* Turn off coheed, cambria, creature

## Shutdown the disk chassis and remaining equipment
* Wait for all machines to stop
* Power off the UPSes
* Turn off the wall socket to power off all equipment.
