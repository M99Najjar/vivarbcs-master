
-- get all doctors
SELECT * FROM Doctors;

-- insert new doctor
INSERT INTO Doctors(name) values('Ammar') RETURNING *;


