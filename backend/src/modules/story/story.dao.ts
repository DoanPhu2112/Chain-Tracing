import prisma from 'prisma/prismaClient';

type StoryProps = {
    title: string;
    description: string;
}
async function createStory(props: StoryProps) {
    const newStory = await prisma.story.create({
        data: {
            title: props.title,
            description: props.description,
            created_at: new Date(),
            updated_at: new Date(),
        }
    })
}