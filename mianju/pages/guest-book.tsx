import React, { useState } from 'react'
import Layout from 'components/Layout'
import {
  Typography, TableContainer, Table, TableBody, TableRow, TableCell, Paper, makeStyles, FormControl,
  Input, InputLabel, Button, FormGroup, Theme
} from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import { ENV } from 'lib/utils';

const apiUrl: string = {
  dev: "localhost:8088",
  production: "jpaddison.net/api"
}[ENV]

const useStyles = makeStyles<Theme>(theme => ({
  tableRoot: {
    marginTop: 30,
    marginBottom: 50,
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
  },
  alert: {
    marginTop: 30,
  }
}))

type GuestEntry = {
  name: string
}

type ErrorSubset = {
  errno: any,
  code: any,
  message: any,
}

type GuestBookProps = {
  guestEntries: GuestEntry[] | null,
  error: ErrorSubset | null,
}

const GuestEntries = ({ guestEntries, error }: GuestBookProps) => {
  const classes = useStyles()

  if (error) {
    console.error(error)
    return <Alert severity="error" className={classes.alert}>{error.message}</Alert>
  }

  return <TableContainer component={Paper} className={classes.tableRoot}>
    <Table>
      <TableBody>
        {guestEntries!.map((guest_entry, i) => {
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

const SignatureForm = ({ addName }: { addName: (name: string) => void }) => {
  const classes = useStyles()
  const [name, updateName] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateName(e.target.value)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('signing with name', name)
    updateName("")
    // TODO;
    // 'https://api.jpaddison.net/guest-book/new'
    const fetchProtocol = ENV === "dev" ? "http" : "https"
    const result = await fetch(`${fetchProtocol}://${apiUrl}/guest-book/new`, {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, public: true })
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
    addName(name)
  }

  // TODO; command enter
  // TODO; private
  return <form onSubmit={onSubmit}>
    <FormControl classes={{ root: classes.formRoot }}>
      <FormGroup row>
        <InputLabel htmlFor="guest_entry">Your name</InputLabel>
        <Input
          id="guest_entry"
          value={name}
          onChange={onChange}
          classes={{ root: classes.input }}
        />
        <Button type="submit" classes={{ root: classes.submitButton }}>
          Sign
        </Button>
      </FormGroup>
    </FormControl>
  </form>
}

export const GuestBook = ({ guestEntries, error }: GuestBookProps) => {
  const [guestEntriesLocal, updateGuestEntriesLocal] = useState<GuestEntry[] | null>(guestEntries)

  // Instead of refetching, we'll just add the name to this list manually. Eh,
  // prolly fine: ¯\_(ツ)_/¯
  const addName = (name: string) => {
    // Word to the wise: If you try to mutate guestEntriesLocal here, it somehow
    // fails to update the table.
    // Second word to the wise, {...null} unpacks it into nothing, but [...null]
    // is a runtime error. Good thing we have typescript to help us catch that.
    const newGuestEntries = [{ name }, ...(guestEntriesLocal || [])]
    updateGuestEntriesLocal(newGuestEntries)
  }

  return <Layout>
    <Typography variant="h2" component="h1" color="primary" gutterBottom>Guest Book</Typography>

    <Typography gutterBottom>Sign your name to the guest book if you like.</Typography>

    <Typography gutterBottom>This page is the result of building an experimental api server in rust. See the souce code on <a href="https://github.com/jpaddison3/jpaddison-net">github</a>.</Typography>

    <SignatureForm addName={addName} />

    <GuestEntries guestEntries={guestEntriesLocal} error={error} />
  </Layout>
}

export async function getServerSideProps(): Promise<{ props: GuestBookProps }> {
  let guestEntries: GuestEntry[] | null = null
  let err: ErrorSubset | null = null
  try {
    // TODO;, obviously
    const res = await fetch(`http://${apiUrl}/guest-book`)
    guestEntries = await res.json()
  } catch (e) {
    console.error(e)
    err = { errno: e.errno, code: e.code, message: e.message }
  }

  return { props: { guestEntries: guestEntries, error: err } }
}

export default GuestBook
