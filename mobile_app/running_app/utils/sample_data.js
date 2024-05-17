export const sampleData = {
    user: {
        id: '933d1bba-aa0b-485f-8e10-95697fb86bd2',
        password: '$2b$12$yTqbjPREQRcC1uNuudk4vuVstU0snfMcM7O8gTdT6mPKzc2sJumCu',
        email: 'Sampleuser1@example.com',
        first_name: 'SampleJohn',
        last_name: 'poe',
        middle_name: 'Smith',
        motto: 'SampleWork hard, play hard',
        height_inches: 2,
        height_feet: 6,
        birthday: '1990-01-01T00:00:00',
        weight_lbs: 200,
        weight_ounces: 8,
        created: '2024-04-07T20:17:51.294000',
        updated: '2024-04-07T20:17:51.294000',
        paid: false
    },
    runs: [
        {
          "id": "914a7fa8-5c92-44e8-b961-96c7aeca40cd",
          "user_id": "933d1bba-aa0b-485f-8e10-95697fb86bd2",
          "start_location": {
            "latitude": 40.7128,
            "longitude": -74.006
          },
          "start_datetime": "2024-04-07T20:17:50.929000",
          "end_location": {
            "latitude": 34.7128,
            "longitude": -118.006
          },
          "end_datetime": "2024-04-07T20:17:50.929000",
          "distance": 10,
          "notes": "Sample run 1",
          "cadence": 160,
          "pace": 6.5,
          "duration": 3600,
          "score": 100,
          "geopoints": [
            {
              "location": {
                "latitude": 40.7128,
                "longitude": -74.006
              },
              "datetime": "2024-04-07T20:17:50.929000",
              "altitude": null,
              "cadence": 155,
              "pace": 6.7,
              "accuracy": null,
              "altitudeAccuracy": null,
              "heading": null,
              "speed": null
            }
          ]
        },
        {
          "id": "833d1bba-aa0b-485f-8e10-95697fb86bd2",
          "user_id": "933d1bba-aa0b-485f-8e10-95697fb86bd2",
          "start_location": {
            "latitude": 0,
            "longitude": 0
          },
          "start_datetime": "2024-05-05T19:29:05.209000",
          "end_location": {
            "latitude": 0,
            "longitude": 0
          },
          "end_datetime": "2024-05-05T19:29:05.209000",
          "distance": 0,
          "notes": "Sample Notes",
          "cadence": 0,
          "pace": 0,
          "duration": 0,
          "score": 1500,
          "geopoints": [
            {
              "location": {
                "latitude": 0,
                "longitude": 0
              },
              "datetime": "2024-05-05T19:29:05.209000",
              "altitude": 0,
              "cadence": 0,
              "pace": 0,
              "accuracy": 0,
              "altitudeAccuracy": 0,
              "heading": 0,
              "speed": 0
            }
          ]
        }
      ],
    teams: [
      {
        "id": "6eaf4c12-8aa0-42d5-8447-e0b598c03bb2",
        "name": "Sample Team A",
        "size": 5,
        "motto": "We strive for excellence",
        "members": [
          "933d1bba-aa0b-485f-8e10-95697fb86bd2",
          "99443ade-f889-415a-a2cb-65f3bbab032b"
        ],
        "owner": "99443ade-f889-415a-a2cb-65f3bbab032b",
        "members_info": [
          {
            "id": "933d1bba-aa0b-485f-8e10-95697fb86bd2",
            "email": "user1@example.com",
            "last_name": "poe",
            "first_name": "John"
          },
          {
            "id": "99443ade-f889-415a-a2cb-65f3bbab032b",
            "email": "user2@example.com",
            "last_name": "Doe",
            "first_name": "Jain"
          }
        ]
      }
    ]
}