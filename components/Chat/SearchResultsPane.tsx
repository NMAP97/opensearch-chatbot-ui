import { Flex, Box, ScrollArea, Text, Card } from "@radix-ui/themes";
import { useContext } from "react";
import { ChatContext } from ".";

const SearchResultsPane = () => {
    const { lastSearchResults } =
        useContext(ChatContext)

    console.log(lastSearchResults)

    return (
        <Flex direction="column">
            <Flex className="p-2 h-full overflow-hidden" direction="column" gap="3">
                <ScrollArea className="flex-1" type="auto" scrollbars="vertical">
                    <Flex direction="column" gap="3">
                        {lastSearchResults.map((searchResult, index) => (
                            // <Box
                            //     key={searchResult.id}
                            //     width="auto"
                            // >
                            //     <Flex gap="2" align="center">
                            //         <Text as="div" className="truncate">
                            //             {searchResult.text}
                            //         </Text>
                            //     </Flex>
                            // </Box>
                            // 
                            <Card key={index} variant="ghost">
                                <Text as="div" size="3">
                                    {searchResult.text}
                                </Text>
                                <Text as="div" color="gray" size="2">
                                    score : {searchResult.score}
                                </Text>
                            </Card>
                        ))}
                    </Flex>
                </ScrollArea>
            </Flex>
        </Flex>
    )
}

export default SearchResultsPane;