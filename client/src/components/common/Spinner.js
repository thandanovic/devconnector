import React from 'react'
import spinner from './spinner.gif'

export default () => {
  return (
    <div>
      <img src={spinner} 
      alt='Loading...' 
      title='Loading...' 
      style={{width:'80px', margin: 'auto', display: 'block'}}
      />
    </div>
  )
}
