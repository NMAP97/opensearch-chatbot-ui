import { useContext } from "react";
import { Flex, Box, ScrollArea, Text, Card, Heading } from "@radix-ui/themes";
import { ChatContext } from ".";

const SearchResultsPane = () => {
    const { lastSearchResults } =
        useContext(ChatContext)

    console.log(lastSearchResults)

    return (
        <Flex className="p-1 h-full overflow-hidden w-full" direction="column">
            {/* <Flex
                justify="between"
                align="center"
                py="3"
                px="4"
                style={{ backgroundColor: 'var(--gray-a2)' }}
            >
                <Heading size="4">Search Results</Heading>
            </Flex> */}
            <ScrollArea type="auto" scrollbars="vertical">
                <Flex direction="column">
                    {lastSearchResults.map((searchResult, index) => (
                        <Box key={searchResult.id} className="p-4 border-b-2 border-x-gray-300">
                            <Flex direction="column">
                                <Text as="div" className="text-pretty" weight="light" size="4">
                                    {index + 1 + ". " + searchResult.text}
                                </Text>
                            </Flex>
                            <Flex direction="column" className="pt-2">
                                <Text as="label" color="gray" size="2">
                                    score : {searchResult.score}
                                </Text>
                            </Flex>
                        </Box>
                    ))}
                </Flex>
            </ScrollArea >
        </Flex >
    )
}

export default SearchResultsPane;