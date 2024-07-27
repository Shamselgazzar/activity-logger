const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  // Clear existing data
  // await prisma.event.deleteMany();
  // await prisma.eventAction.deleteMany();
  // await prisma.user.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'Ali Salah',
      email: 'ali@instatus.com',
      group: 'instatus.com'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@instatus.com',
      group: 'instatus.com'
    }
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane@instatus.com',
      group: 'instatus.com'
    }
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@instatus.com',
      group: 'instatus.com'
    }
  });

  const user5 = await prisma.user.create({
    data: {
      name: 'Hany Adel',
      email: 'hany@instatus.com',
      group: 'instatus.com'
    }
  });

  // Create event actions
  const loginAction = await prisma.eventAction.create({
    data: {
      name: 'user.login_succeeded'
    }
  });

  const searchAction = await prisma.eventAction.create({
    data: {
      name: 'user.search_performed'
    }
  });

  const incidentCreatedAction = await prisma.eventAction.create({
    data: {
      name: 'incident.created_successfully'
    }
  });

  const incidentUpdatedAction = await prisma.eventAction.create({
    data: {
      name: 'incident.updated_successfully'
    }
  });

  const incidentDeletedAction = await prisma.eventAction.create({
    data: {
      name: 'incident.deleted_successfully'
    }
  });

  const incidentResolvedAction = await prisma.eventAction.create({
    data: {
      name: 'incident.resolved_successfully'
    }
  });

  const incidentAssignedAction = await prisma.eventAction.create({
    data: {
      name: 'incident.assigned_successfully'
    }
  });

  const userDeletedAction = await prisma.eventAction.create({
    data: {
      name: 'user.deleted_successfully'
    }
  });


  // Create events
  await prisma.event.create({
    data: {
      actorId: user1.id,
      actionId: loginAction.id,
      targetId: user2.id,
      location: '105.40.62.95',
      occurredAt: new Date('2022-01-05T14:31:13.607Z'),
      metadata: {
        redirect: '/setup',
        description: 'User login succeeded.',
        x_request_id: 'req_W1Y13QOHMI5H'
      }
    }
  });

  await prisma.event.create({
    data: {
      actorId: user2.id,
      actionId: searchAction.id,
      location: '105.40.62.95',
      occurredAt: new Date('2022-01-06T14:31:13.607Z'),
      metadata: {
        description: 'User performed a search.',
        search_query: 'Prisma ORM',
        x_request_id: 'req_Y2X43QOHMI5H'
      }
    }
  });

  await prisma.event.create({
    data: {
      actorId: user1.id,
      actionId: incidentCreatedAction.id,
      location: '105.40.62.95',
      occurredAt: new Date('2022-01-05T14:31:13.607Z'),
      metadata: {
        description: 'Incident created successfully.',
        x_request_id: 'req_W1Y13QOHMI5H'
      }
    }
  });

  await prisma.event.create({
    data: {
      actorId: user3.id,
      actionId: incidentUpdatedAction.id,
      location: '105.40.62.95',
      occurredAt: new Date('2022-01-06T14:31:13.607Z'),
      metadata: {
        description: 'Incident updated successfully.',
        x_request_id: 'req_Y2X43QOHMI5H'
      }
    }
  });

  await prisma.event.create({
    data: {
      actorId: user4.id,
      actionId: incidentDeletedAction.id,
      location: '105.40.62.95',
      occurredAt: new Date('2022-01-06T14:31:13.607Z'),
      metadata: {
        description: 'Incident deleted successfully.',
        x_request_id: 'req_Y2X43QOHMI5H'
      }
    }
  });

  await prisma.event.create({
    data: {
      actorId: user5.id,
      actionId: incidentResolvedAction.id,
      location: '105.40.62.95',
      occurredAt: new Date('2022-01-06T14:31:13.607Z'),
      metadata: {
        description: 'Incident resolved successfully.',
        x_request_id: 'req_Y2X43QOHMI5H'
      }
    }
  });

  await prisma.event.create({
    data: {
      actorId: user1.id,
      actionId: incidentAssignedAction.id,
      location: '105.40.62.95',
      occurredAt: new Date('2022-01-05T14:31:13.607Z'),
      metadata: {
        description: 'Incident assigned successfully.',
        x_request_id: 'req_W1Y13QOHMI5H'
      }
    } 
  }); 

    await prisma.event.create({ 
      data: { 
        actorId: user1.id, 
        actionId: incidentAssignedAction.id, 
        targetId: user3.id,
        location: '105.40.62.95', 
        occurredAt: new Date('2022-01-06T14:31:13.607Z'), 
        metadata: { 
          description: 'Incident assigned successfully.', 
          x_request_id: 'req_Y2X43QOHMI5H' 
        } 
      } 
    });

    await prisma.event.create({ 
      data: { 
        actorId: user2.id, 
        actionId: userDeletedAction.id, 
        targetId: user5.id,
        location: '105.40.62.95', 
        occurredAt: new Date('2022-01-06T14:31:13.607Z'), 
        metadata: { 
          description: 'Incident assigned successfully.', 
          x_request_id: 'req_Y2X43QOHMI5H' 
        } 
      } 
    });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
