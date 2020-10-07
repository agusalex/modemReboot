#!/bin/sh
reboot(){   
    echo "Reboot Started at $(date)";
    node $SCRIPT
}
echo "Starting Modem Rebooter..."
if [ -z "$CRON" ]; then
    echo "Crontab Not Present:"
    reboot

else
    echo "Crontab Present, Scheduling Reboot at $CRON";
    echo "The time now is $(date)";
    echo "$CRON node /usr/src/app/$SCRIPT" > /etc/crontabs/root;
    crond -f -d 8;
fi
