import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContactDto } from './dtos';
import { Contact } from './entity';
import { ContactInterface } from './interfaces';
import { AppConstants } from './constants';
import { contactsCurator } from './helpers/contact-curator.helper';

type ContactBodyType = ContactDto;

@Injectable()
export class AppService {
constructor(  
  @InjectRepository(Contact)
  private readonly contactRepository: Repository<Contact>
) {}

  async identifyContact(contactDto: ContactBodyType): Promise<{contact:{
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];}
}>{
    let contactByEmail: ContactInterface, contactByPhone: ContactInterface, contactResult;
    let primaryContactId: number;
    let primaryContact: Contact;
    let emails: string[] = []; 
    let phoneNumbers: string[] = []; 
    let secondaryContactIds: number[] = [];
    let contactCards: Contact[];

    const { email, phoneNumber } = contactDto;

    //check if ccontact already exists 
    email && (contactByEmail = await this.contactRepository.findOne({
      where: { email }
    }));
    phoneNumber && (contactByPhone = await this.contactRepository.findOne({
      where: { phoneNumber: phoneNumber }
    }));

    
    if(!contactByEmail && !contactByPhone){
      await this.contactRepository.save({
        email,
        phoneNumber,
        linkPrecedence: AppConstants.PRIMARY,
        linkedId: null,
        deletedAt: null,
      }); 
    }
    else if(contactByEmail?.email === email && contactByEmail?.phoneNumber === phoneNumber) {
      //do nothing
    }
    else if (contactByEmail && contactByPhone && (contactByEmail?.id != contactByPhone?.id)) {
        const isEmailFirst = contactByEmail.createdAt < contactByPhone.createdAt;
        const isSecondary = contactByEmail.linkPrecedence === AppConstants.SECONDARY;

        await this.contactRepository
        .update(
          { id: isEmailFirst ? contactByPhone.id : contactByEmail.id},
          {
            linkPrecedence: AppConstants.SECONDARY,
            linkedId: isEmailFirst ? (isSecondary ? contactByEmail.linkedId : contactByEmail.id)
         : (isSecondary ? contactByPhone.linkedId : contactByPhone.id)
          }
        ); 
    }
    else if((contactByEmail && phoneNumber) || (contactByPhone && email)){
      const isSecondary = contactByEmail ? contactByEmail.linkPrecedence === AppConstants.SECONDARY 
      : contactByPhone.linkPrecedence === AppConstants.SECONDARY;

      await this.contactRepository.save({
        email,
        phoneNumber,
        linkPrecedence: AppConstants.SECONDARY,
        linkedId: contactByEmail ? (isSecondary ? contactByEmail.linkedId : contactByEmail.id)
         : (isSecondary ? contactByPhone.linkedId : contactByPhone.id),
        deletedAt: null,
      }); 
    }

    //fetch all the user infos finally.
    let contact = await this.contactRepository.findOne({
      where: [
        { email },
        { phoneNumber }
      ]
    });

    let isPrimary: boolean = contact.linkPrecedence === AppConstants.PRIMARY;
    primaryContactId = isPrimary ? contact.id : contact.linkedId;
    primaryContact = isPrimary ? contact : await this.contactRepository.findOne({ where: { id: contact.linkedId } });

    contactCards = await this.contactRepository.find({
      where: { linkedId: primaryContact.id },
    });

    emails = [primaryContact.email];
    phoneNumbers = [primaryContact.phoneNumber];
    secondaryContactIds = [];

    contactResult = contactsCurator(contactCards,emails,
      phoneNumbers,secondaryContactIds,
      primaryContactId);

    return {contact: contactResult};
  }
}
