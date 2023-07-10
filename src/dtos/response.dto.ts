
export class ContactResponseDto {
		contact:{
			primaryContactId: number;
			emails: string[]; 
			phoneNumbers: string[]; 
			secondaryContactIds: number[];
		}
	}
