const receiversString = process.env.RECEIVERS
const receivers = []
for (const receiverString of receiversString.split(",")) {
  const receiver = receiverString.split(":")
  receivers.push({display_name: receiver[0], channel: receiver[1]})
}

exports.getModalView = () => {
  let template = {
      type: "modal",
      callback_id: "send_post",
      title: {
        type: "plain_text",
        text: "意見を送る",
        emoji: true
      },
      submit: {
        type: "plain_text",
        text: "送信",
        emoji: true
      },
      close: {
        type: "plain_text",
        text: "キャンセル",
        emoji: true
      },
      blocks: [
        {
          block_id: "receiver",
          type: "input",
          label: {
            type: "plain_text",
            text: "送信先",
            emoji: true
          },
          element: {
            type: "static_select",
            options: [],
            initial_option: {},
            action_id: "input_value"
          }
        },
        {
          block_id: "input_text",
          type: "input",
          label: {
            type: "plain_text",
            text: "本文",
            emoji: true
          },
          element: {
            type: "plain_text_input",
            multiline: true,
            action_id: "input_value"
          }
        },
        {
          block_id: "is_anonymous",
          type: "input",
          element: {
            type: "checkboxes",
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "匿名で送る",
                  emoji: true
                },
                value: "true"
              }
            ],
            action_id: "input_value"
          },
          label: {
            type: "plain_text",
            text: "オプション設定",
            emoji: true
          },
          optional: true
        }
      ]
    };

  receivers.forEach((receiver, index) => {
    template.blocks[0].element.options.push(
      {
        text: {
          type: "plain_text",
          text: receiver.display_name,
          emoji: true
        },
        value: `${index}`
      }
    )
    template.blocks[0].element.initial_option = template.blocks[0].element.options.find((item) => {
      return item.display_name === process.env.DEFAULT_RECEIVER
    })
  });

  return template;
};

