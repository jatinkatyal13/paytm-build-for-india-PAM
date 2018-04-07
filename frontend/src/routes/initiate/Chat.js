import React, { Component } from 'react';

import {
    ChatFeed,
    Message
} from 'react-chat-ui';

export default class Chat extends Component {

    constructor(){
        super()
    }

    getMessages(){
        var list = []
        this.props.messages.map((message, i) => {
            list.push(new Message({id: message.id, message: message.message}))
        })
        return list
    }

    render() {
        return(
            <ChatFeed
                messages={ this.getMessages() } // Boolean: list of message objects
                hasInputField={ false } // Boolean: use our input, or use your own
                maxHeight = { 200 }
                style = {{ marginTop: 20 }}
                // JSON: Custom bubble styles
                bubbleStyles={
                    {
                        text: {
                            fontSize: 30
                        },
                        chatbubble: {
                            borderRadius: 70,
                            padding: 40
                        }
                    }
                }
            />
        )
    }

}