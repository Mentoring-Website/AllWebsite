import React from 'react'
import Comments from '../comments/Comments'
import UserInfo from '../userInfo/UserInfo'
import Opp from '../opp/Opp'
import { userInfo as items } from '../data/data'

const OppInfo = ({id}) => {
  return (
    <div>
      {
        <>
          {items.opp.map(item => <Opp item={item} key={item.title} />)}
          <div className='user'>
            <UserInfo item={items} key={items.title} />
            <Comments id={id}/>
          </div>
        </>
      }

    </div>
  )
}

export default OppInfo