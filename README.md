# SlackMeyasubako

Slackで簡易的な目安箱機能を実現するBot

(2020年3月にINIAD-FES実行委員会用に製作したものをDocker対応したものです)

## Install and Run
1. Config Slack Bot on [Slack API](https://api.slack.com/apps) (see [Slack Requirements](#Slack-Requirements))
2. Clone Repository
3. Make .env file (see [.env](#.env))
4. Run `docker-compose up -d --build`

## Config
### .env
```
PORT=8080
TZ=Asia/Tokyo
DB_NAME=meyasubako
DB_USERNAME=root
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=changeit
DB_PASSWORD=changeit
SLACK_SIGNING_SECRET=[Slack Signing Secret]
SLACK_BOT_TOKEN=[Slack Bot Token]
RECEIVERS="委員長&副委員長:#目安箱_最高幹部,委員長:U000000,副委員長:U000000
```

## Slack Requirements

* A Bot User
* Subscribed to Events

### Scopes

* [`chat:write`](https://api.slack.com/scopes/chat:write)
* [`groups:history`](https://api.slack.com/scopes/groups:history)
* [`im:history`](https://api.slack.com/scopes/im:history)

### Events

#### Workspace events

* [`app_home_opened`](https://api.slack.com/events/app_home_opened)
* [`message.groups`](https://api.slack.com/events/message.groups)
* [`message.im`](https://api.slack.com/events/message.im)


## Dependent libraries

* [Slack Bolt](https://slack.dev/bolt/concepts)
* [LoDash](https://lodash.com/docs/)
* [NeDB](https://github.com/louischatriot/nedb)
* [Day.js](https://github.com/iamkun/dayjs)


## Author

ayame.space(ayame.space@gmail.com)
