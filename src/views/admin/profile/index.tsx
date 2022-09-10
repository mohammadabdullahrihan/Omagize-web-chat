// Chakra imports
import { Box, Grid } from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/profile/components/Banner';
import General from 'views/admin/profile/components/General';
import Notifications from 'views/admin/profile/components/Notifications';
import OwnedGroups from 'views/admin/profile/components/OwnedGroups';

export default function Overview() {
	return (
		<Box>
			<Grid
				templateColumns={{
					base: '1fr',
					lg: '0.66fr 0.34fr'
				}}
				templateRows={{
					base: 'auto auto',
					lg: '1fr'
				}}
				gap={{ base: '20px', xl: '20px' }}>
				<Banner />
				<Notifications
					used={25.6}
					total={50}
				/>
			</Grid>
			<Grid
				mb='20px'
				templateColumns={{
					base: '1fr',
					lg: 'repeat(2, 1fr)',
				}}
				templateRows='auto auto'
				gap={{ base: '20px', xl: '20px' }}>
				<OwnedGroups />
				<General minH='365px' pe='20px' />
			</Grid>
		</Box>
	);
}
