import { Contact } from "src/entity";

export function contactsCurator(contactCards: Contact[], emails: string[],
phoneNumbers:string[], secondaryContactIds:number[], primaryContactId: number){
    contactCards.forEach(contact => {
        contact.email && emails.push(contact.email);
        contact.phoneNumber && phoneNumbers.push(contact.phoneNumber);
        secondaryContactIds.push(contact.id);
    });

    emails = [...new Set(emails)];
    phoneNumbers = [...new Set(phoneNumbers)];
    secondaryContactIds = [...new Set(secondaryContactIds)];
    
    return {
        primaryContactId,
        emails,
        phoneNumbers, 
        secondaryContactIds,
    }
};
