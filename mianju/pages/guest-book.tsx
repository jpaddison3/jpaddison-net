import React, { useState } from 'react'
import Layout from 'components/Layout'
import {
  Typography, TableContainer, Table, TableBody, TableRow, TableCell, Paper, makeStyles, FormControl,
  Input, InputLabel, Button, FormGroup, Theme
} from '@material-ui/core'

const useStyles = makeStyles<Theme>(theme => ({
  tableRoot: {
    marginTop: 30,
    width: 350,
  },
  formRoot: {
    display: "flex",
    width: 350,
  },
  input: {
    flexGrow: 1,
  },
  submitButton: {
    ...theme.typography.body2,
    marginTop: 16,
  }
}))

type GuestEntry = {
  name: string
}

type GuestBookProps = {
  guest_entries: GuestEntry[]
}

const GuestEntries = ({ guest_entries }: GuestBookProps) => {
  const classes = useStyles()

  return <TableContainer component={Paper} className={classes.tableRoot}>
    <Table>
      <TableBody>
        {guest_entries.map((guest_entry, i) => {
          return <TableRow key={i}>
            <TableCell>
              {guest_entry.name}
            </TableCell>
          </TableRow>
        })}
      </TableBody>
    </Table>
  </TableContainer>
}

const SignatureForm = () => {
  const classes = useStyles()
  const [name, updateName] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateName(e.target.value)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('signing with name', name)
    // TODO;
    // 'https://api.jpaddison.net/guest-book/new'
    const result = await fetch("http://localhost:8088/guest-book/new", {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name, public: true})
    })
    if (!result.ok) {
      console.error("Failed to sign guest book, got error code:", result.status)
      const errMsg = await result.text()
      if (errMsg.length) {
        console.error("Error message:", errMsg)
      } else {
        console.error("No further error information given")
      }
    }
  }

  // TODO; command enter
  // TODO; private
  return <form onSubmit={onSubmit}>
    <FormControl classes={{ root: classes.formRoot }}>
      <FormGroup row>
        <InputLabel htmlFor="guest_entry">Your name</InputLabel>
        <Input id="guest_entry" onChange={onChange} classes={{ root: classes.input }} />
        <Button type="submit" classes={{ root: classes.submitButton }}>
          Sign
        </Button>
      </FormGroup>
    </FormControl>
  </form>
}

export const GuestBook = ({ guest_entries }: GuestBookProps) => {
  return <Layout>
    <Typography variant="h2" component="h1" color="primary" gutterBottom>Guest Book</Typography>

    <Typography gutterBottom>Sign your name to the guest book if you like.</Typography>

    <Typography gutterBottom>This page is the result of building an experimental api server in rust. See the souce code on <a href="https://github.com/jpaddison3/jpaddison-net">github</a>.</Typography>

    <SignatureForm />

    <GuestEntries guest_entries={guest_entries} />
  </Layout>
}

// TODO; refetch
// TODO; optimistic response
export async function getServerSideProps(): Promise<{ props: GuestBookProps }> {
  // TODO;, obviously
  const res = await fetch("http://localhost:8088/guest-book")
  console.log("res", res)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { guest_entries: data } }
}

export default GuestBook
