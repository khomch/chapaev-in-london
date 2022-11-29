import React, { ChangeEvent, FC, SyntheticEvent, useState } from 'react'
import { observer } from 'mobx-react-lite'

import styles from './MessagesList.module.sass'
import { ChatMessage } from '../ChatMessage/ChatMessage'
import { Message } from '../../../types/forumType'
import { UsePagination } from '../../../hooks/usePagination'
import { limitShowChatMessage } from '../../../assets/config'
import stores from '../../../store'
import { Avatar } from '../../UI-elements/Avatar/Avatar'
import stylesInput from '../../UI-elements/Input/Input.module.sass'
import { ButtonSend } from '../../UI-elements/ButtonSend/ButtonSend'

type MessagesListProps = {
  messages: Message[];
  handleForm: ( message: string) => void
}

export const MessagesList: FC<MessagesListProps> = observer(({ messages, handleForm }) => {
  const [activeMessages, setCurrentMessages] = useState(messages)
  const [message, setMessage] = useState('')

  const { user } = stores.authorization

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()

    if (message) {
      handleForm(message)
      setMessage('')
    }
  }

  const handleChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }
  return (
    <div className={styles.messagesList}>
      <ul>
        {
          activeMessages.map(message => (
            <ChatMessage
              key={message.id + Date.now()}
              message={message}
            />
          ))
        }
      </ul>

      <UsePagination<Message>
        limit={limitShowChatMessage}
        list={messages}
        paginateList={setCurrentMessages}
      />

      <div className={styles.messagesList__sendMessage}>
        <Avatar src={user?.avatar ?? ''} />
        <form
          className={styles.messagesList__form}
          onSubmit={handleSubmit}>
         <textarea
           className={stylesInput.input + ' ' + stylesInput.input_primary + ' ' + styles.messagesList__textArea}
           onChange={handleChangeMessage}
           value={message}
           placeholder={'Введите сообщение...'}
         />
          <ButtonSend type={'submit'} />
        </form>
      </div>
    </div>
  )
})