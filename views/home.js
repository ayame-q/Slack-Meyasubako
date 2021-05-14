const dayjs = require("dayjs");

const receiversString = process.env.RECEIVERS
const receivers = []
for (const receiverString of receiversString.split(",")) {
  const receiver = receiverString.split(":")
  receivers.push({display_name: receiver[0], channel: receiver[1]})
}

exports.getHomeview = (posts) => {
  let template = {
    type: "home",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "ここでは幹部にあなたの意見を送ることができます。\nちょっとしたアイディア:bulb:や疑問:shrug:、不満:rage:などぜひお気軽にご投稿ください！:slightly_smiling_face:"
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "新しい意見を送る"
            },
            action_id: "home_new_post_modal"
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "image",
            image_url:
              "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
            alt_text: "placeholder"
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*投稿履歴*"
        }
      },
      {
        type: "divider"
      }
    ]
  };

  for (const post of posts) {
    template.blocks.push(
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: post.text
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text:
              "*送信先:* " +
              receivers[post.receiver.id].display_name +
              (post.is_anonymous ? " (匿名投稿)" : "") +
              "\n" +
              dayjs(post.created_at).format("YYYY-MM-DD HH:mm:ss")
          }
        ]
      }
    );
    for (const reply of post.replies) {
      const send_text = `> *<@${reply.sender.id}>*
${reply.text.replace(/^(.*)$/g, "> $1")}
> ${dayjs(reply.created_at).format("YYYY-MM-DD HH:mm:ss")}
> 

`;

      template.blocks.push({
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: send_text
          }
        ]
      });
    }

    template.blocks.push({
      type: "divider"
    });
  }

  return template;
};
