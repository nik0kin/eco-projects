import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Stack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { DesignerGrid } from '../lib/grid-types';

interface OptionsProps {
  preloadedGridSize: [number, number];
  saveGridData: (grid: DesignerGrid) => void;
  onClaimSizeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const Options: FC<OptionsProps> = ({
  preloadedGridSize,
  saveGridData,
  onClaimSizeChange,
}) => {
  const selectDefaultValue = `${preloadedGridSize[0]}x${preloadedGridSize[1]}`;
  return (
    <Card variant="outline" width={['100%', 'initial']}>
      <CardBody>
        <Box>
          <Heading size="s" textTransform="uppercase">
            Options
          </Heading>
          <Stack spacing={4} direction="row" align="end">
            <FormControl mb={2}>
              <Checkbox isDisabled>Show grid</Checkbox>
            </FormControl>
            <FormControl>
              <FormLabel>Claim Size</FormLabel>
              <Select
                name="grid-size"
                onChange={onClaimSizeChange}
                defaultValue={selectDefaultValue}
              >
                <option value="1x1">1x1</option>
                <option value="1x2">1x2</option>
                <option value="1x3">1x3</option>
                <option value="2x1">2x1</option>
                <option value="2x2">2x2</option>
                <option value="2x3">2x3</option>
                <option value="3x1">3x1</option>
                <option value="3x2">3x2</option>
                <option value="3x3">3x3</option>
              </Select>
            </FormControl>
            <Button colorScheme="red" variant="outline" px={6} onClick={() => saveGridData({})}>
              Reset
            </Button>
          </Stack>
        </Box>
      </CardBody>
    </Card>
  );
};
