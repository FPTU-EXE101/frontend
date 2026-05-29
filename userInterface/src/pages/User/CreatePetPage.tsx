import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import petApi from "@/apis/petAPI";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getCurrentUserId } from "@/lib/auth";
import { queryKeys } from "@/lib/queryKeys";
import type { CreatePetRequest } from "@/types/pet.type";

type CreatePetFormValues = {
  name: string;
  species: string;
  color: string;
  dateOfBirth: string;
};

const getTodayInputValue = (): string => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().split("T")[0];
};

const validationSchema: Yup.ObjectSchema<CreatePetFormValues> = Yup.object({
  name: Yup.string().trim().required("Vui lòng nhập tên thú cưng."),
  species: Yup.string().trim().required("Vui lòng nhập loài thú cưng."),
  color: Yup.string().trim().required("Vui lòng nhập màu sắc thú cưng."),
  dateOfBirth: Yup.string()
    .required("Vui lòng nhập ngày sinh của thú cưng.")
    .test(
      "not-in-future",
      "Ngày sinh không được lớn hơn ngày hiện tại.",
      (value) => !value || value <= getTodayInputValue(),
    ),
});

const CreatePetPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const maxDate = useMemo(() => getTodayInputValue(), []);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formik = useFormik<CreatePetFormValues>({
    initialValues: {
      name: "",
      species: "",
      color: "",
      dateOfBirth: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (loading || submitSuccess) return;

      setSubmitError(null);
      setSubmitSuccess(false);

      const customerId = getCurrentUserId();
      if (!customerId) {
        setSubmitError(
          "Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.",
        );
        return;
      }

      const payload: CreatePetRequest = {
        customerId,
        name: values.name,
        species: values.species,
        color: values.color,
        dateOfBirth: values.dateOfBirth,
      };

      try {
        setLoading(true);
        await petApi.createPet(payload);
        await queryClient.invalidateQueries({
          queryKey: queryKeys.userPets(customerId),
        });
        setSubmitSuccess(true);
        formik.resetForm();
        setTimeout(() => {
          navigate("/user/pet");
        }, 1200);
      } catch (error: unknown) {
        console.error(error);
        let errorMessage =
          "Tạo thú cưng thất bại. Vui lòng kiểm tra lại thông tin.";

        if (isAxiosError<{ message?: string }>(error)) {
          errorMessage = error.response?.data?.message || errorMessage;
        }

        setSubmitError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={formik.handleSubmit}
          className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              className="h-10 w-10 rounded-full p-0 hover:bg-slate-100"
              aria-label="Quay lại"
            >
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </Button>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                Thêm thú cưng
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Nhập thông tin cơ bản để đăng ký thú cưng của bạn.
              </p>
            </div>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Tên thú cưng *</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nhập tên thú cưng"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              <FieldError
                errors={
                  formik.touched.name && formik.errors.name
                    ? [{ message: formik.errors.name }]
                    : undefined
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="species">Loài thú cưng *</FieldLabel>
              <Input
                id="species"
                name="species"
                type="text"
                placeholder="VD: Chó, Mèo, Thỏ..."
                value={formik.values.species}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                list="customer-species-list"
                required
              />
              <datalist id="customer-species-list">
                <option value="Chó" />
                <option value="Mèo" />
                <option value="Chim" />
                <option value="Chuột" />
                <option value="Thỏ" />
                <option value="Khác" />
              </datalist>
              <FieldError
                errors={
                  formik.touched.species && formik.errors.species
                    ? [{ message: formik.errors.species }]
                    : undefined
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="color">Màu sắc / Đặc điểm *</FieldLabel>
              <Input
                id="color"
                name="color"
                type="text"
                placeholder="VD: Nâu, Trắng, Đen..."
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              <FieldError
                errors={
                  formik.touched.color && formik.errors.color
                    ? [{ message: formik.errors.color }]
                    : undefined
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="dateOfBirth">Ngày sinh *</FieldLabel>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                max={maxDate}
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              <FieldError
                errors={
                  formik.touched.dateOfBirth && formik.errors.dateOfBirth
                    ? [{ message: formik.errors.dateOfBirth }]
                    : undefined
                }
              />
            </Field>

            {submitError ? (
              <FieldDescription className="text-center text-sm text-red-600">
                {submitError}
              </FieldDescription>
            ) : null}

            {submitSuccess ? (
              <FieldDescription className="text-center text-sm text-emerald-600">
                Tạo thú cưng thành công! Đang chuyển về danh sách thú cưng...
              </FieldDescription>
            ) : null}

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/user/pet")}
                disabled={loading || submitSuccess}
                className="flex-1 rounded-full"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={loading || submitSuccess}
                className="flex-1 rounded-full bg-[#D56756] px-5 py-3 text-base font-semibold text-white hover:bg-[#b34c47] disabled:cursor-not-allowed disabled:bg-[#d89992]"
              >
                {loading ? "Đang lưu..." : "Thêm thú cưng"}
              </Button>
            </div>

            <FieldDescription className="text-center text-sm text-slate-500">
              <Link
                to="/user/pet"
                className="font-medium text-[#D56756] hover:text-[#b34c47]"
              >
                Quay về danh sách thú cưng
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

export default CreatePetPage;
