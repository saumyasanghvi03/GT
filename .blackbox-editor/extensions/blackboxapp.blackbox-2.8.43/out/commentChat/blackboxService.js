module.exports.askBlackbox = async (context, userPrompt, currentChatHistory, activeLines = '') => {
  try {
    const userId = context.globalState.get('userId');
  
    const requestBody = {
      userId,
      textInput: userPrompt,
      allMessages: currentChatHistory,
      source: 'visual studio',
      clickedContinue: false,
      stream: '',
      activeLines
    };
    const response = await fetch('https://useblackbox.io/chat-v5', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  
    const result = await response.json();
  
    return result.output
  } catch (error) {
    console.log('error: ', error)
    return ''
  }
};