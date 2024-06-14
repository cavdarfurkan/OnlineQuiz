import { useEffect } from "react";
import EditCourseForm from "../../components/forms/EditCourseForm";
import {
  changeMenuItemVisibility,
  updateMenuItemPath,
} from "../../app/features/sidebar/sidebarSlice";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const EditCoursePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateMenuItemPath({
        index: 6,
        path: `/courses/${id}/edit`,
      })
    );
    dispatch(
      updateMenuItemPath({
        index: 4,
        path: `/courses/${id}/exams`,
      })
    );
    dispatch(
      changeMenuItemVisibility({
        index: 4,
        show: true,
      })
    );
    dispatch(
      changeMenuItemVisibility({
        index: 6,
        show: true,
      })
    );
    dispatch(
      changeMenuItemVisibility({
        index: 7,
        show: true,
      })
    );
  }, [dispatch, id]);

  return (
    <>
      <div>
        <h1>Edit Course</h1>
        <hr />
      </div>
      <div>
        <EditCourseForm />
      </div>
    </>
  );
};

export default EditCoursePage;
