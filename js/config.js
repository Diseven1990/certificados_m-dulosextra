// js/config.js

window.CERT_CONFIG = {
  courses: [
    {
      id: "photoshop",
      label: "Adobe Photoshop",
      template: "templates/photoshop.pdf",
      fields: {
        name:  { pageIndex: 0, x: 413, y: 68, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 413, y: 25, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 65,  y: 135, w: 200, fontSize: 40 }
      },
      style: {
        textColorRgb: [1, 1, 1],
        gradeColorRgb: [1, 1, 1],
        gradeBold: true
      }
    }
  ]
};
