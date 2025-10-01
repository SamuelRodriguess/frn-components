import React from 'react'

type Props = {
  name: string
}

function Greeting({ name }: Props) {
  return <div>Heyssss, {name}</div>
}

export default Greeting
