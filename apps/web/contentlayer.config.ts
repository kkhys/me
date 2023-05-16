import { makeSource } from 'contentlayer/source-files';

import { Post } from './contents/definitions/Post';

export default makeSource({
  contentDirPath: 'contents',
  documentTypes: [Post],
});
