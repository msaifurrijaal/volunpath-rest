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
      description:
        "Mitra Organization focuses on community development projects.",
    },
  });

  // Create CategoryEvents
  await prisma.categoryEvent.createMany({
    data: [
      { name: "Education", description: "Events related to education." },
      { name: "Healthy Food", description: "Events related to healthy food." },
      {
        name: "Medical Help",
        description: "Events related to medical help.",
      },
      {
        name: "Social Service",
        description: "Events related to social service.",
      },
    ],
  });

  const educationCategory = await prisma.categoryEvent.findUnique({
    where: { name: "Education" },
  });

  const healthCategory = await prisma.categoryEvent.findUnique({
    where: { name: "Medical Help" },
  });

  const socialCategory = await prisma.categoryEvent.findUnique({
    where: { name: "Social Service" },
  });

  const foodCategory = await prisma.categoryEvent.findUnique({
    where: { name: "Healthy Food" },
  });

  const event1 = await prisma.event.create({
    data: {
      organizer_id: organizationUser.id,
      title: "Belajar Bersama Anak-anak Panti Asuhan Bunga",
      description:
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur",
      date: new Date("2024-06-01T10:00:00Z"),
      location: "Batu, Malang",
      slots_needed: 10,
      slots_available: 10,
      category_id: educationCategory?.id,
      status: "open_registration",
      image:
        "https://res.cloudinary.com/df5zedkiz/image/upload/v1717301562/ogjfetkcpj0vfgcmqppc.jpg",
    },
  });

  const event2 = await prisma.event.create({
    data: {
      organizer_id: organizationUser.id,
      title: "Cek Kesehatan Anak Sekolah",
      description:
        "Providing free health check-ups for the community. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur",
      date: new Date("2024-06-15T09:00:00Z"),
      location: "Malang",
      slots_needed: 5,
      slots_available: 5,
      category_id: healthCategory?.id,
      status: "open_registration",
      image:
        "https://res.cloudinary.com/df5zedkiz/image/upload/v1717299213/ovhkjb3natpbsoyh3z0c.jpg",
    },
  });

  const event3 = await prisma.event.create({
    data: {
      organizer_id: organizationUser.id,
      title: "Berbagi Makanan Sehat untuk Siswa SDN Maju Indonesia",
      description:
        "Membantu siswa SDN Maju Indonesia menyediakan makanan sehat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
      date: new Date("2024-06-01T10:00:00Z"),
      location: "Lowokwaru, Malang",
      slots_needed: 10,
      slots_available: 10,
      category_id: foodCategory?.id,
      status: "open_registration",
      image:
        "https://res.cloudinary.com/df5zedkiz/image/upload/v1720239783/food_hxo42f.jpg",
    },
  });

  const event4 = await prisma.event.create({
    data: {
      organizer_id: organizationUser.id,
      title: "Kerja Bakti bersama warga Kepanjen",
      description:
        "Membantu warga Kepanjen Kerja Bakti. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      date: new Date("2024-06-01T10:00:00Z"),
      location: "Central Park",
      slots_needed: 10,
      slots_available: 10,
      category_id: socialCategory?.id,
      status: "open_registration",
      image:
        "https://res.cloudinary.com/df5zedkiz/image/upload/v1717301562/ogjfetkcpj0vfgcmqppc.jpg",
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
