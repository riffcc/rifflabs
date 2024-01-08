---
sidebar_position: 2
---

# Startup procedures

Carefully rehydrating the Riff Lab is a delicate process that takes some coordination. Any improvements to automation that can be created to make this process easier are welcome. All suggestions encouraged.

## Getting started
* Gather a rough idea of the state of the lab. Potentially take a quick photo and make a note of the event.
* If anything is messy or out of place, clean it up before you get started.

## Start the smart wall socket
* Turn on the wall socket to power on all equipment.
* Turn on the UPSes

## Start the Core Services nodes
* Ensure Coheed, Cambria and Creature are all running. Take note if one isn't.

## Start the UniFi controller
* Go to https://coresvc.riff.cc:8006 and login. Then, under coheed, make sure `unifi01` is started and running.

:::tip

It's at this point that all main network services should be online for Abhorsen's House.

:::

## Start the Main Proxmox cluster
* Start up al, ambellina, monstar, inferno, sizer, unless any were off for a reason.

## Start the MooseFS filesystem
* Connect to the MooseFS master node (currently monstar) and start the MooseFS master service. This will allow the MooseFS filesystem to be mounted on the MooseFS master node.
    * SSH to ambellina as root and run `systemctl start moosefs-pro-master`
    * Then check if the MooseFS master service successfully started:
        `systemctl status moosefs-pro-master` (Q to quit back to the shell)
    * If it failed to start, run `mfsmaster -a` to start in recovery mode. You may want to do this in a separate `screen` session.

:::tip

You can enter a screen session by typing `screen -S nameofyourchoice`. You can then detach from the screen session by holding Control, hitting A, then D. You can reattach to the screen session by typing `screen -r nameofyourchoice`.

:::

* Connect to each MooseFS chunkserver node (currently al, ambellina, monstar) and start the MooseFS chunkserver service. This will allow the MooseFS filesystem to be mounted on the MooseFS chunkserver nodes.
    * SSH to each host as root and run `systemctl start moosefs-pro-chunkserver`
    * Then check if the MooseFS chunkserver service successfully started:
        `systemctl status moosefs-pro-chunkserver` (Q to quit back to the shell)

## Ensure Rancher Longhorn is fully functional
* On each host, run `df -h /mnt/longhorn` and check that each mount is functional.
    * They should look like this:
    ```
    Filesystem                Size  Used Avail Use% Mounted on
    /dev/mapper/pve-longhorn  1.5T  104G  1.3T   8% /mnt/longhorn
    ```
    * If they do not, `umount /mnt/longhorn` and then `mount /mnt/longhorn` to remount them.
    * If needed, run `lsof /mnt/longhorn` to find any processes locking /mnt/longhorn and then kill them with `kill $PID` where $PID is the process ID of the process.
* Go to https://rancher.riff.cc, sign in with your Authentik credentials, and then go to the Longhorn section and check that all replicas are healthy.

## Start MergerFS on each of the main Proxmox hosts
* This concerns al, ambellina, monstar, inferno, sizer
* On each host, run `df -h /mnt/plots` and check that each mount is functional.
    * If they are not, run `umount /mnt/plots` and then `mount /mnt/plots` to remount them.
    * If needed, run `lsof /mnt/plots` to find any processes locking /mnt/plots and then kill them with `kill $PID` where $PID is the process ID of the process.

## Start the nfs-kernel-service process
* On sizer, ambellina, al, run `systemctl start nfs-kernel-server`
* On monstar, make sure all three mounts are successfully mounted:
    * `mount -a`
    * `mount | grep nfs`
    * If they are not, run `mount -a` again or `umount $mountpoint` and then `mount $mountpoint` to remount them.

## Start the Farmer
* Log onto the Farmer (`ssh monstar.riff.cc`) and run
```
./start-plotsink.sh
./start-plotmover.sh
./start-farmer.sh
```

## Start the Secondary Plotters
* Log onto Al, Ambellina and Inferno and run the following:
```
./start-plotsink.sh
./start-plotmover.sh
./start-plotter.sh
```

## Monitor the health of the cluster
Visit http://monitoring.riff.cc/monitoring, log in, and check that everything looks in reasonable health.

:::warning

There will be plenty of alarm bells ringing in CheckMK (our monitoring system) for the next few weeks, so don't be too alarmed if there are CRITICAL alerts.

:::
