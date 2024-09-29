const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Workout = require("../models/workoutModel");
const workouts = require("./data/workouts.js");

let token = null;
let workoutId = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api
    .post("/api/user/signup")
    .send({ email: "testuser@example.com", password: "TestPass123!" });
  token = result.body.token;
});

beforeEach(async () => {
  await Workout.deleteMany({});

  // Add initial workouts
  const response = await api
    .post("/api/workouts")
    .set("Authorization", `bearer ${token}`)
    .send(workouts[0]);

  workoutId = response.body._id; // Store ID of the first workout
});

describe("Workout API Operations", () => {
  describe("GET a single workout", () => {
    it("should successfully return a single workout by ID", async () => {
      const response = await api
        .get(`/api/workouts/${workoutId}`)
        .set("Authorization", `bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.title).toBe(workouts[0].title);
      expect(response.body.reps).toBe(workouts[0].reps);
      expect(response.body.load).toBe(workouts[0].load);
    });

    it("should return 404 if the workout ID does not exist", async () => {
      const nonExistentId = new mongoose.Types.ObjectId(); // Fixed 'new' usage
      await api
        .get(`/api/workouts/${nonExistentId}`)
        .set("Authorization", `bearer ${token}`)
        .expect(404);
    });
  });

  describe("DELETE a workout", () => {
    it("should successfully delete a workout by ID", async () => {
      await api
        .delete(`/api/workouts/${workoutId}`)
        .set("Authorization", `bearer ${token}`)
        .expect(204); // Make sure your controller is returning 204

      const response = await api
        .get(`/api/workouts`)
        .set("Authorization", `bearer ${token}`);

      expect(response.body).toHaveLength(0); // No workouts should remain
    });

    it("should return 404 if attempting to delete a non-existent workout", async () => {
      const nonExistentId = new mongoose.Types.ObjectId(); // Fixed 'new' usage
      await api
        .delete(`/api/workouts/${nonExistentId}`)
        .set("Authorization", `bearer ${token}`)
        .expect(404);
    });
  });

  describe("UPDATE a workout", () => {
    it("should successfully update an existing workout", async () => {
      const updatedWorkout = {
        title: "Updated Workout",
        reps: 50,
        load: 60,
      };

      const response = await api
        .patch(`/api/workouts/${workoutId}`)
        .set("Authorization", `bearer ${token}`)
        .send(updatedWorkout)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.title).toBe(updatedWorkout.title);
      expect(response.body.reps).toBe(updatedWorkout.reps);
      expect(response.body.load).toBe(updatedWorkout.load);
    });

    it("should return 400 if invalid data is sent for update", async () => {
      const invalidData = { title: "", reps: "invalid", load: -10 }; // Invalid data

      await api
        .patch(`/api/workouts/${workoutId}`)
        .set("Authorization", `bearer ${token}`)
        .send(invalidData)
        .expect(400); // Should properly return 400 on invalid data
    });

    it("should return 404 if the workout ID does not exist", async () => {
      const nonExistentId = new mongoose.Types.ObjectId(); // Fixed 'new' usage
      const updatedWorkout = {
        title: "Non-existent Workout",
        reps: 25,
        load: 100,
      };

      await api
        .patch(`/api/workouts/${nonExistentId}`)
        .set("Authorization", `bearer ${token}`)
        .send(updatedWorkout)
        .expect(404);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
