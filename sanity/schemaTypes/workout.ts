export default {
  name: 'workout',
  title: 'Workout',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Clerk user ID for the user who performed the workout',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      description: 'Total duration of the workout in seconds',
      validation: (Rule: any) => Rule.required().integer().min(0),
    },
    {
      name: 'sets',
      title: 'Sets',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'workoutSet',
          title: 'Workout Set',
          fields: [
            {
              name: 'exercise',
              title: 'Exercise',
              type: 'reference',
              to: [{type: 'exercise'}],
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'reps',
              title: 'Reps',
              type: 'number',
              validation: (Rule: any) => Rule.required().integer().min(0),
            },
            {
              name: 'weight',
              title: 'Weight',
              type: 'number',
              validation: (Rule: any) => Rule.min(0),
            },
            {
              name: 'weightUnit',
              title: 'Weight Unit',
              type: 'string',
              options: {
                list: [
                  {title: 'lbs', value: 'lbs'},
                  {title: 'kg', value: 'kg'},
                ],
                layout: 'radio',
              },
              initialValue: 'lbs',
            },
          ],
          preview: {
            select: {
              title: 'exercise.name',
              media: 'exercise.image',
              reps: 'reps',
              weight: 'weight',
              unit: 'weightUnit',
            },
            prepare(selection: any) {
              const {title, media, reps, weight, unit} = selection
              let subtitle = reps !== undefined ? `${reps} reps` : '—'
              if (weight !== undefined && weight !== null)
                subtitle += ` • ${weight}${unit ? ` ${unit}` : ''}`
              return {title, media, subtitle}
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      userId: 'userId',
      date: 'date',
      sets: 'sets',
      media: 'sets.0.exercise.image',
    },
    prepare(selection: any) {
      const {userId, date, sets, media} = selection
      const count = Array.isArray(sets) ? sets.length : 0
      const dateStr = date ? new Date(date).toLocaleString() : undefined
      return {
        title: `${userId} — ${count} set${count === 1 ? '' : 's'}`,
        media,
        subtitle: dateStr,
      }
    },
  },
}
