import { createMuiTheme } from '@material-ui/core/styles'

const serifFontStack = 'Georgia, serif'
const sansSerifFontStack = 'Helvetica, "Helvetica Neue", Arial, sans-serif'

// build headings
const headingNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
type HeadingName = typeof headingNames[number];
type Headings = Partial<Record<HeadingName, { fontFamily: string, fontWeight: number }>>
const headings = headingNames.reduce((coll: Headings, h: HeadingName) => {
  coll[h] = {
    fontFamily: sansSerifFontStack,
    fontWeight: 700
  }
  return coll
}, {} as Headings)

// build theme
export const theme = createMuiTheme({
  typography: {
    fontFamily: serifFontStack,
    body2: {
      fontFamily: sansSerifFontStack
    },
    ...headings
  },
  palette: {
    primary: {
      main: '#71eeb8',
      light: '#a6ffea',
      dark: '#38bb88',
      contrastText: '#000000'
    }
  }
})
