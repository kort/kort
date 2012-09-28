#!/bin/bash
### BEGIN INIT INFO
# Provides:          redmine
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: redmine webrick
# Description:       redmine webrick server autostart-script
### END INIT INFO

# Adapted from this script: http://www.redmine.org/boards/1/topics/9334

. /lib/lsb/init-functions

# Modify it to your configuration
DIR=/home/redmine/redmine-2.1.0/

# Start Redmine in daemon mode.
start(){
	log_daemon_msg "Starting Redmine WebRick"
	cd $DIR
	log_progress_msg
	ruby script/rails server webrick -d -e production -p8080 &> /dev/null
	log_progress_msg
	log_end_msg 0
}

# Stop Redmine daemon
stop(){
	log_daemon_msg "Stopping Redmine WebRick"
	RUBYPID=`ps aux | grep "ruby script/rails server webrick -d -e production -p8080" | grep -v grep | awk '{print $2}'`
	log_progress_msg
	if [ "x$RUBYPID" != "x" ]; then
		kill -2 $RUBYPID
	fi
	log_end_msg 0
}

# Check if Redmine is running
status(){
	RUBYPID=`ps aux | grep "ruby script/rails server webrick -d -e production -p8080" | grep -v grep | awk '{print $2}'`
	if [ "x$RUBYPID" = "x" ]; then
		echo "* Redmine is not running"
	else
		echo "* Redmine is running"
	fi
}


case "$1" in
	start)
		start
		;;
	
	stop)
		stop
		;;
	
	status)
		status
		;;
	
	restart|force-reload)
		stop
		start
		;;

	*)
		echo "Usage: $0 {start|stop|restart|force-reload|status}"
		exit 1

esac
