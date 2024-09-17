import { Box } from 'grommet';
import { useMemo } from 'react';
import sanitizeHtml, { defaults } from 'sanitize-html';
import { Endpoints, METHOD } from '../utils/api';
import { usePregameService } from '../utils/hooks';
import QueryComponent from './QueryComponent';

function GetPageHtml({
  name,
  replaceString,
  replaceValue,
  children,
}: {
  name: string;
  replaceString?: string;
  replaceValue?: string;
  children?: (
    data: Endpoints['/game-data/PregameService/getPage'][METHOD.GET]['resBody'],
  ) => JSX.Element;
}) {
  const queryResult = usePregameService('/game-data/PregameService/getPage', { name });

  const sanitizedHtml = useMemo(() => {
    if (queryResult.data?.value !== undefined) {
      let sanitizedHtml = sanitizeHtml(queryResult.data?.value, {
        allowedTags: [...defaults.allowedTags, 'button'],
        allowedAttributes: { ...defaults.allowedAttributes, button: ['onclick'] },
      });
      if (replaceString !== undefined && replaceValue !== undefined) {
        sanitizedHtml = sanitizedHtml.replaceAll(replaceString, replaceValue);
      }
      return sanitizedHtml;
    }
  }, [queryResult.data?.value, replaceString, replaceValue]);

  return (
    <QueryComponent queryResult={queryResult}>
      {(data) => (
        <>
          {sanitizedHtml !== undefined && (
            <Box
              background="brand"
              fill
              align="center"
              pad="medium"
              justify="start"
              overflow="auto"
            >
              {/* eslint-disable-next-line react/no-danger */}
              <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
              {children !== undefined && children(data)}
            </Box>
          )}
        </>
      )}
    </QueryComponent>
  );
}

export default GetPageHtml;
