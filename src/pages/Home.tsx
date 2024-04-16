import { useState } from "react";
import {
  Box,
  Textarea,
  Button,
  VStack,
  Text,
  Flex,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Link,
  Divider,
  useClipboard,
} from "@chakra-ui/react";
import * as React from "react";

const Home = () => {
  const [input, setInput] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [calculations, setCalculations] = useState<string[]>([]);
  const { hasCopied, onCopy } = useClipboard(input);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const calculateTotal = () => {
    const lines = input.split("\n");
    let localTotal = 0;
    const localCalculations: string[] = [];

    lines.forEach((line) => {
      const [calc, description] = line.split(" ");
      try {
        // This is a simplified parser, it evaluates the line directly
        const lineTotal = eval(calc);
        localTotal += lineTotal;
        localCalculations.push(
          `${calc} = ${lineTotal} (${description || "No description"})`
        );
      } catch (error) {
        localCalculations.push(`Error parsing line: ${line}`);
      }
    });

    setTotal(localTotal);
    setCalculations(localCalculations);
  };

  const tips = [12, 15, 18, 20];

  return (
    <Flex direction="column" align="center" w="100vw" pb="5%" bg="white">
      <Box w="100%" bg="lightblue" p="6%">
        <Heading color="black" size="lg" as="b">
          Gathering Expense Calculator
        </Heading>
        <Text>
          Use this tool to quickly calculate expenses and determine projected
          total spend. Tip options included. Tax calculations are not included.
        </Text>
      </Box>
      <VStack spacing={4} width="100%" pl="10%" pr="10%" pt="2%" bg="white">
        <Textarea
          placeholder={
            "Enter expenses, one per line." + "\n" + "example: 10*2 pizza"
          }
          value={input}
          onChange={handleInputChange}
          colorScheme="linkedin"
          size="lg"
          height="100%"
          minHeight="150px"
        />
        <HStack>
          <Button onClick={onCopy} colorScheme="teal">
            {hasCopied ? "Copied!" : "Copy"}
          </Button>{" "}
          <Button colorScheme="blue" onClick={calculateTotal}>
            Calculate Total
          </Button>
        </HStack>

        <Divider />
        {total > 0 && (
          <>
            <Text as="b" color="red" fontSize="xl">
              Raw Total: ${total.toFixed(2)}
            </Text>
            <Divider />
            <Text>
              Note: Tax is not included in this calculator. 5% GST meals tax
              (BC) or 13% HST (ON).{" "}
              <Link
                isExternal
                href="https://www.restaurantscanada.org/industry-news/sales-taxes-on-food-beverages/"
              >
                See Sales taxes on food and beverages guide
              </Link>{" "}
              for more info.
            </Text>
            <Divider />
            <Heading size="md">Totals with different tip %</Heading>
            <HStack>
              {tips.map((tip) => (
                <Box key={tip} bg="lightblue" borderRadius="20px" p="3%">
                  <Text key={tip} fontSize="md">
                    {tip}% tip:{" "}
                    <b>${(total + (total * tip) / 100).toFixed(2)}</b>
                  </Text>
                </Box>
              ))}
            </HStack>
            <Divider />
            <Heading size="md">Order Breakdown</Heading>

            {calculations.length > 0 && (
              <Table variant="striped" size="sm" colorScheme="telegram">
                <Thead>
                  <Tr>
                    <Th>Calculation</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {calculations.map((calc, index) => {
                    const [calculation, description] = calc.split(" (");
                    return (
                      <Tr key={index}>
                        <Td>{calculation}</Td>
                        <Td>{description.replace(")", "")}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </>
        )}
        {calculations}
        <Box pb="1%" />
      </VStack>
    </Flex>
  );
};

export default Home;
