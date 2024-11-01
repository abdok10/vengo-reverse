const schema = {
  name: "F1XwX11", // required unique
  description: "form_description", // nullable
  account_id: 2, //required (1 - 10 )

  template: [
    {
      section_name: "S1", // required
      required: true,
      reservation_status_name: "active",
      reservation_status_id: "1", //required (1 - 10 )
      fields: [
        // required
        {
          field_id: 1, // automatic
          required: true,
          name: "S1F1",
          type: "image", // ( liste deroulante)
          options: ["url", "base64"],

          reservation_status_name: "active",
          reservation_status_id: "2", //required (1 - 10 )
        },
        {
          field_id: 2, // Changed to 2 for uniqueness
          name: "S1F2",
          type: "text",
          options: ["short", "long"],
          required: false,
          reservation_status_name: "active",
          reservation_status_id: "2",
        },
        {
          field_id: 2, // Changed to 2 for uniqueness
          name: "S1F3",
          type: "text",
          options: ["short", "long"],
          required: false,
          reservation_status_name: "active",
          reservation_status_id: "2",
        },
      ],
    },
    {
      section_name: "S2",
      required: false,
      reservation_status_name: "inactive",
      reservation_status_id: "1",
      fields: [
        {
          field_id: 3, // You can assign an actual ID here
          name: "S2F1",
          type: "date",
          options: ["past", "future"],
          required: false,
          reservation_status_name: "active",
          reservation_status_id: "2",
        },
        {
          field_id: 4, // You can assign an actual ID here
          name: "S2F2",
          type: "text",
          options: ["mobile", "landline"],
          required: true,
          reservation_status_name: "active",
          reservation_status_id: "2",
        },
      ],
    },
    {
      section_name: "S3",
      required: false,
      reservation_status_name: "active",
      reservation_status_id: "3",
      fields: [
        {
          field_id: 5, // You can assign an actual ID here
          name: "S3F1",
          type: "select",
          options: ["Email", "SMS", "Push"],
          required: false,
          reservation_status_name: "active",
          reservation_status_id: "2",
        },
        {
          field_id: 6, // You can assign an actual ID here
          name: "S3F2",
          type: "checkbox",
          options: ["Email", "SMS", "Push"],
          required: false,
          reservation_status_name: "active",
          reservation_status_id: "2",
        },
      ],
    },
  ],
};
