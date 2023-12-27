---
sidebar_position: 2
---
import NetworkTerminationDevice from './assets/network-termination-device.png';

# Setting up a router

You'll need (or you might already have!) a router to connect your network to the internet, connect your networks to each other and provide basic services.

Everyone has preferences, and at Riff Labs we prefer MikroTik routers (for now). Ubiquiti, Cisco, Fortinet and more also make great routers.

Or, if you're handy, you can even **build your own** router from commodity PC hardware quite cheaply. It all depends on your needs.

## Our router
The Riff Labs router is a MikroTik RB5009UG+S+IN. It's a cheap little router that can easily handle gigabit speeds, and will likely be replaced with something more powerful later.

## Physical setup
The first step to setting up a router is the physical setup. Since the RB5009 is a rackmount-compatible router, we set it up in our network rack.

Then, we plug in internet into the WAN port - by default, this is the first ethernet port, `ether1-WAN`.`

The internet access in our case comes from a device called a Network Termination Device (NTD). It could also come from a device like a cable modem or DSL modem, however.

<img src={NetworkTerminationDevice} style={{width: 300}} alt="An example of a NTD" />

From here, you'll want to plug in something like a desktop (or a laptop with a LAN adapter) into one of the remaining ports on the router. Once that's done, follow the instructions given by the manufacturer for initial setup and configuration of the router.

We won't cover too much more of the networking side here - this should be enough to get you a basic flat network with a built-in DHCP server (that's the thing that hands out IP addresses to your local network) and possibly DNS server/cache.

Now, let's get our first server setup.