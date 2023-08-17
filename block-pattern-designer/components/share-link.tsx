import { Button, Card, CardBody, Heading, useClipboard } from '@chakra-ui/react';
import React, { FC } from 'react';

export const ShareLink: FC<{ pageUrl: string }> = ({ pageUrl }) => {
  const { onCopy, hasCopied } = useClipboard(pageUrl, 2000);
  return (
    <Card variant="outline" width={['100%', 'initial']} mb={4}>
      <CardBody>
        <Heading size="s" textTransform="uppercase" mb={3}>
          Share Design
        </Heading>
        <Button onClick={onCopy} width="100px">
          {!hasCopied ? 'Copy link' : 'Copied'}
        </Button>
      </CardBody>
    </Card>
  );
};
