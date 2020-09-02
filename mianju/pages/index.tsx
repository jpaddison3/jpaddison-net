import styled from 'styled-components'
import { Layout } from "../components/Layout";
import { brand } from '../lib/theme';

const SiteHeading = styled.h1`
  color: ${brand}
`

export default function Home() {
  return <Layout>
    <SiteHeading>Hello</SiteHeading>
  </Layout>
}
