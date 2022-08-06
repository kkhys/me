import React from 'react';
import { Text, Heading, Button, Section, Grid } from '^/elements';

const Home = () => (
  <>
    <h1 className='text-3xl font-bold underline'>Hello world!!!</h1>
    <Text>text test</Text>
    <Heading>heading test</Heading>
    <Button>button test</Button>
    <Section heading='section test'>
      <Text>test</Text>
    </Section>
    <Grid items={3}>
      <Text>grid test 1</Text>
      <Text>grid test 2</Text>
      <Text>grid test 3</Text>
    </Grid>
  </>
);

export default Home;
