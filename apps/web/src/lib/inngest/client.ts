import { EventSchemas, Inngest } from "inngest";

type HelloWorld = {
  data: {
    email: string;
  };
};
type Events = {
  "test/hello.world": HelloWorld;
};

export const inngest = new Inngest({
  id: "me",
  schemas: new EventSchemas().fromRecord<Events>(),
});
