var ConversationV1 = require('watson-developer-cloud/conversation/v1');

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: '31be4934-c02e-441a-96e6-d639b4ab69a8', // replace with username from service key
  password: 'Q2hapKhopVRj', // replace with password from service key
  path: { workspace_id: 'b2d3a074-4d46-4b95-b902-f70d0000fdc6' }, // replace with workspace ID
  version_date: '2016-07-11'
});

// Start conversation with empty message.
conversation.message({}, processResponse);

// Process the conversation response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }
  
  // Display the output from dialog, if any.
  if (response.output.text.length != 0) {
      console.log(response.output.text[0]);
  }
}
