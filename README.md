# hubot-koku

hubot-koku is a chat bot built on the [Hubot][hubot] framework. It was
initially generated by [generator-hubot][generator-hubot], and configured to be
deployed on [OpenShift][openshift] to get you up and running as quick as possible.

This README is intended to help get you started. Definitely update and improve
to talk about your own instance, how to use and deploy, what functionality is
available, etc!

[heroku]: http://www.openshift.com
[hubot]: http://hubot.github.com
[generator-hubot]: https://github.com/github/generator-hubot

### Running hubot-koku Locally

You can test your hubot by running the following, however some plugins will not
behave as expected unless the [environment variables](#configuration) they rely
upon have been set.

You can start hubot-koku locally by running:

    % bin/hubot

You'll see some start up output and a prompt:

    [Sat Feb 28 2015 12:38:27 GMT+0000 (GMT)] INFO Using default redis on localhost:6379
    hubot-koku>

Then you can interact with hubot-koku by typing `hubot-koku help`.

    hubot-koku> hubot-koku help
    hubot-koku animate me <query> - The same thing as `image me`, except adds [snip]
    hubot-koku help - Displays all of the help commands that hubot-koku knows about.
    ...

### Configuration

A few scripts (including some installed by default) require environment
variables to be set as a simple form of configuration.

Each script should have a commented header which contains a "Configuration"
section that explains which values it requires to be placed in which variable.
When you have lots of scripts installed this process can be quite labour
intensive. The following shell command can be used as a stop gap until an
easier way to do this has been implemented.

    grep -o 'hubot-[a-z0-9_-]\+' external-scripts.json | \
      xargs -n1 -I {} sh -c 'sed -n "/^# Configuration/,/^#$/ s/^/{} /p" \
          $(find node_modules/{}/ -name "*.coffee")' | \
        awk -F '#' '{ printf "%-25s %s\n", $1, $2 }'

How to set environment variables will be specific to your operating system.
Rather than recreate the various methods and best practices in achieving this,
it's suggested that you search for a dedicated guide focused on your OS.


### Deploy

This project is meant to be deployed to OpenShift. You can do so with the following commands.

```
$ export NAMESPACE=myproject
$ export SLACK_TOKEN=xoxb-YOUR-TOKEN-HERE
$ export SLACK_CHANNEL_WHITELIST=mychannel  # comma separated list of channels
$ oc login
$ oc project $NAMESPACE
$ oc process -f openshift/hubot-koku.yaml --param NAMESPACE=$NAMESPACE --param SLACK_TOKEN=$SLACK_TOKEN --param SLACK_CHANNEL_WHITELIST=$SLACK_CHANNEL_WHITELIST | tee >(oc apply -n $NAMESPACE -f -)
```

