import { Request , Response } from 'express';
import { PrismaClient, Contact } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to filter out null/undefined values
const filterTruthy = <T>(value: T): value is NonNullable<T> => value != null;

export const identifyHandler = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ error: 'Either email or phoneNumber is required' });
    }

    const contacts: Contact[] = await prisma.contact.findMany({
      where: {
        deletedAt: null,
        OR: [
          { email: email ?? undefined },
          { phoneNumber: phoneNumber ?? undefined },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    if (contacts.length === 0) {
      const newContact = await prisma.contact.create({
        data: {
          email: email ?? null,
          phoneNumber: phoneNumber ?? null,
          linkPrecedence: 'primary',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        contact: {
          primaryContactId: newContact.id,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: [],
        },
      });
    }

    const primaryContact = contacts.find((c: Contact) => c.linkPrecedence === 'primary') ?? contacts[0];

    const linkedContacts: Contact[] = await prisma.contact.findMany({
      where: {
        OR: [
          { id: primaryContact.id },
          { linkedId: primaryContact.id },
        ],
        deletedAt: null,
      },
    });

    const emailExists = linkedContacts.some(c => c.email === email);
    const phoneExists = linkedContacts.some(c => c.phoneNumber === phoneNumber);

    if ((email && !emailExists) || (phoneNumber && !phoneExists)) {
      await prisma.contact.create({
        data: {
          email: email ?? null,
          phoneNumber: phoneNumber ?? null,
          linkedId: primaryContact.id,
          linkPrecedence: 'secondary',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const updatedContacts: Contact[] = await prisma.contact.findMany({
        where: {
          OR: [
            { id: primaryContact.id },
            { linkedId: primaryContact.id },
          ],
          deletedAt: null,
        },
      });

      const emails = Array.from(new Set(updatedContacts.map(c => c.email).filter(filterTruthy)));
      const phoneNumbers = Array.from(new Set(updatedContacts.map(c => c.phoneNumber).filter(filterTruthy)));
      const secondaryContactIds = updatedContacts
        .filter(c => c.linkPrecedence === 'secondary')
        .map(c => c.id);

      return res.status(200).json({
        contact: {
          primaryContactId: primaryContact.id,
          emails,
          phoneNumbers,
          secondaryContactIds,
        },
      });
    }

    // Return consolidated info
    const emails = Array.from(new Set(linkedContacts.map(c => c.email).filter(filterTruthy)));
    const phoneNumbers = Array.from(new Set(linkedContacts.map(c => c.phoneNumber).filter(filterTruthy)));
    const secondaryContactIds = linkedContacts
      .filter(c => c.linkPrecedence === 'secondary')
      .map(c => c.id);

    return res.status(200).json({
      contact: {
        primaryContactId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    });
  } catch (error) {
    console.error('Error in /identify:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default identifyHandler;

