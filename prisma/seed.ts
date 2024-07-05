import prisma from "../prisma/client";
import * as bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  // Create Users with different roles
  const adminUser = await prisma.user.create({
    data: {
      username: "adminUser",
      email: "admin@example.com",
      password: hashedPassword,
      fullname: "Admin User",
      phone: "081234567890",
      address: "Jl. Jendral Sudirman No. 1",
      city: "Jakarta",
      role: "admin",
      status: "active",
    },
  });

  const volunteerUser = await prisma.user.create({
    data: {
      username: "volunteerUser",
      email: "volunteer@example.com",
      password: hashedPassword,
      fullname: "Volunteer User",
      phone: "089712369713",
      address: "Jl. Jendral Sudirman No. 2",
      city: "Surabaya",
      role: "volunteer",
      status: "active",
    },
  });

  const organizationUser = await prisma.user.create({
    data: {
      username: "organizationUser",
      email: "organization@example.com",
      password: hashedPassword,
      fullname: "Mitra User",
      phone: "085712369713",
      address: "Jl. Indah No. 3",
      city: "Malang",
      role: "organization",
      status: "active",
    },
  });

  const superAdminUser = await prisma.user.create({
    data: {
      username: "superAdminUser",
      email: "superadmin@example.com",
      password: hashedPassword,
      fullname: "Super Admin User",
      phone: "087712369713",
      address: "Jl. Permata No. 4",
      city: "Surakarta",
      role: "super_admin",
      status: "active",
    },
  });

  // Create VolunteerDetail for volunteerUser
  await prisma.volunteerDetail.create({
    data: {
      user_id: volunteerUser.id,
      skills: "Teaching, First Aid",
      education: "Bachelor of Science",
      other_details: "Available for weekend activities",
    },
  });

  // Create OrganizationDetail for organizationUser
  await prisma.organizationDetail.create({
    data: {
      user_id: organizationUser.id,
      name: "Mitra Organization",
      address: "123 Mitra Street",
      focus: "Community Development",
      description: "Mitra Organization focuses on community development projects.",
    },
  });

  // Create CategoryEvents
  await prisma.categoryEvent.createMany({
    data: [
      { name: "Education", description: "Events related to education." },
      { name: "Health", description: "Events related to health." },
      { name: "Environment", description: "Events related to environmental conservation." },
    ],
  });

  // Fetch the category IDs
  const educationCategory = await prisma.categoryEvent.findUnique({
    where: { name: "Education" },
  });

  const healthCategory = await prisma.categoryEvent.findUnique({
    where: { name: "Health" },
  });

  // Create Events
  const event1 = await prisma.event.create({
    data: {
      organizer_id: organizationUser.id,
      title: "Community Clean-Up",
      description: "Join us in cleaning up the local park.",
      date: new Date("2024-06-01T10:00:00Z"),
      location: "Central Park",
      slots_needed: 10,
      slots_available: 10,
      category_id: educationCategory?.id,
      status: "open_registration",
      image: "https://res.cloudinary.com/df5zedkiz/image/upload/v1717301562/ogjfetkcpj0vfgcmqppc.jpg",
    },
  });

  const event2 = await prisma.event.create({
    data: {
      organizer_id: organizationUser.id,
      title: "Health Camp",
      description: "Providing free health check-ups for the community.",
      date: new Date("2024-06-15T09:00:00Z"),
      location: "Community Center",
      slots_needed: 5,
      slots_available: 5,
      category_id: healthCategory?.id,
      status: "open_registration",
      image: "https://res.cloudinary.com/df5zedkiz/image/upload/v1717299213/ovhkjb3natpbsoyh3z0c.jpg",
    },
  });

  // Create Registrations
  await prisma.activity.create({
    data: {
      volunteer_id: volunteerUser.id,
      event_id: event1.id,
      status: "pending",
      statusPayment: "pending",
      motivation: "I want to contribute to keeping the environment clean.",
      additional_info: "I will bring my own cleaning tools.",
    },
  });

  await prisma.activity.create({
    data: {
      volunteer_id: volunteerUser.id,
      event_id: event2.id,
      status: "pending",
      statusPayment: "pending",
      motivation: "I want to help provide health services to the community.",
      additional_info: "I have experience in assisting medical professionals.",
    },
  });

  // Create Reports
  await prisma.report.create({
    data: {
      event_id: event1.id,
      volunteer_id: volunteerUser.id,
      feedback: "Great event, well organized.",
    },
  });

  await prisma.report.create({
    data: {
      event_id: event2.id,
      volunteer_id: volunteerUser.id,
      feedback: "Very helpful for the community.",
    },
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
