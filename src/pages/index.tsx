import React from 'react';
import { Text, Heading, Button, Section } from '^/elements';

const Home = () => (
  <>
    <h1 className='text-3xl font-bold underline'>Hello world!!!</h1>
    <Text>text test</Text>
    <Heading>heading test</Heading>
    <Button>button test</Button>
    <Section heading='section test'>
      <Text>test</Text>
    </Section>
  </>
);

export default Home;
