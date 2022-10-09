// Chakra imports
import {Avatar, Flex, Text, useColorModeValue} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import {useColors} from "variables/colors";
import {useGroupsQuery} from "api/GroupAPI";
import FadeImage from "components/card/utils/FadeImage";
import {useContext} from "react";
import {PageContext} from "contexts/PageContext";
import {Group} from "../../../../api/types/Group";

export default function OwnedGroups(props: { [x: string]: any }) {
	const { ...rest } = props;
	// Chakra Color Mode
	const {textColorPrimary, textColorSecondary} = useColors()

	const query = useGroupsQuery()

	if (query.isLoading) return <></>
	const groups = query.data
	return (
		<Card {...rest}>
			<Text color={textColorPrimary} fontWeight='bold' fontSize='2xl' mt='10px' mb='4px'>
				Owned Groups
			</Text>
			<Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
				All groups which is owned by you
			</Text>
			<Flex direction='column' gap={3}>
				{groups.filter(group => group.owner).map(group =>
					<GroupItem key={group.id} group={group} />
				)}
			</Flex>
		</Card>
	);
}

function GroupItem({group}: {group: Group}) {
	const {brand, borderColor} = useColors()
	const cardShadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'unset');
	const bg = useColorModeValue('white', 'navy.700');
	const {setSelectedGroup} = useContext(PageContext)

	return <Card
		pos='relative' bg={bg} boxShadow={cardShadow} overflow='hidden'
		_hover={{cursor: 'pointer'}} onClick={() => setSelectedGroup(group.id)}
	>
		<FadeImage
			src={group.bannerUrl}
			placeholder={brand}
			direction='to left'
			image={{
				filter: 'auto', brightness: 0.9
			}}
		/>

		<Flex direction={{base: 'column', lg: 'row'}} pos='relative' gap={2}>
			<Avatar name={group.name} src={group.iconUrl} border='4px solid' w='100px' h='100px' borderColor={borderColor} />
			<Text fontSize='2xl' fontWeight='bold' mt='10px' maxW={{base: '80%', lg: '40%'}}>{group.name}</Text>
		</Flex>
	</Card>
}