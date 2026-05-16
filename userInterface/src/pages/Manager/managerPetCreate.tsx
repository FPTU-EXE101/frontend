import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import petApi from "@/apis/petAPI";
import userApi from "@/apis/userAPI";
import type { CreatePetRequest, Pet } from "@/types/pet.type";
import type { UserProfileValues } from "@/types/userProfile.type";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft } from "lucide-react";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Vui lòng chọn tên thú cưng."),
  species: Yup.string()
    .trim()
    .required("Vui lòng chọn hoặc nhập loài thú cưng."),
  color: Yup.string()
    .trim()
    .required("Vui lòng nhập màu/đặc điểm của thú cưng."),
  dateOfBirth: Yup.string().required("Vui lòng nhập ngày sinh của thú cưng."),
});

interface PetFormValues {
  name: string;
  species: string;
  color: string;
  dateOfBirth: string;
}

const ManagerPetCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [users, setUsers] = useState<UserProfileValues[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<UserProfileValues | null>(
    null,
  );
  const [ownerPets, setOwnerPets] = useState<Pet[]>([]);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response?.data ?? []);
      } catch (err) {
        console.error("Không tải được danh sách người dùng", err);
      }
    };

    loadUsers();
  }, []);

  const ownerOptions = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return [];

    return users
      .filter((user) => {
        const email = user.email?.toString?.() ?? "";
        const userName = user.userName?.toString?.() ?? "";
        return (
          email.toLowerCase().includes(query) ||
          userName.toLowerCase().includes(query)
        );
      })
      .slice(0, 6);
  }, [userSearch, users]);

  const handleOwnerSelect = async (owner: UserProfileValues) => {
    setSelectedOwner(owner);
    setUserSearch("");
    setOwnerPets([]);
    setSubmitError(null);
    formik.setFieldValue("name", "");

    const customerId = owner.id || owner.id || "";
    if (!customerId) {
      setSubmitError("Chủ thú cưng chưa có ID hợp lệ.");
      return;
    }

    try {
      setOwnerLoading(true);
      const response = await petApi.getPetByCustomerId(customerId);
      setOwnerPets(response?.data ?? []);
    } catch (err) {
      console.error(err);
      setSubmitError("Không tải được thú cưng của chủ này.");
    } finally {
      setOwnerLoading(false);
    }
  };

  const formik = useFormik<PetFormValues>({
    initialValues: {
      name: "",
      species: "",
      color: "",
      dateOfBirth: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      setSubmitSuccess(false);

      if (!selectedOwner) {
        setSubmitError("Vui lòng chọn chủ thú cưng trước khi tạo pet.");
        return;
      }

      const customerId = selectedOwner.id || selectedOwner.id || "";
      if (!customerId) {
        setSubmitError("Chủ thú cưng chưa có ID hợp lệ.");
        return;
      }

      try {
        setLoading(true);
        const petData: CreatePetRequest = {
          customerId,
          name: values.name,
          species: values.species,
          color: values.color,
          dateOfBirth: values.dateOfBirth,
        };

        const response = await petApi.createPet(petData);
        if (response?.data) {
          setSubmitSuccess(true);
          formik.resetForm();
          setSelectedOwner(null);
          setOwnerPets([]);
          setTimeout(() => {
            navigate("/manager/pets");
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        setSubmitError(
          "Thêm thú cưng thất bại. Vui lòng kiểm tra lại thông tin.",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-[calc(100vh-3rem)]  px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full ">
        <form
          onSubmit={formik.handleSubmit}
          className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="h-10 w-10 rounded-full p-0 hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </Button>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                Thêm thú cưng
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Manager tạo thú cưng cho khách hàng.
              </p>
            </div>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ownerEmail">Chủ thú cưng *</FieldLabel>
              <Input
                id="ownerEmail"
                name="ownerEmail"
                type="text"
                placeholder="Tìm theo email chủ nhân"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                autoComplete="off"
              />
              {ownerOptions.length > 0 && !selectedOwner ? (
                <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  {ownerOptions.map((owner) => (
                    <button
                      type="button"
                      key={owner.id || owner.id || owner.email}
                      onClick={() => handleOwnerSelect(owner)}
                      className="mb-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 last:mb-0"
                    >
                      <div className="font-semibold text-slate-900">
                        {owner.userName || owner.email}
                      </div>
                      <div className="text-slate-500">{owner.email}</div>
                    </button>
                  ))}
                </div>
              ) : null}
              {selectedOwner ? (
                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-medium text-slate-900">Chủ đã chọn</div>
                  <div>
                    {selectedOwner.userName || selectedOwner.email} -{" "}
                    {selectedOwner.email}
                  </div>
                </div>
              ) : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="name">Tên thú cưng *</FieldLabel>
              {selectedOwner && ownerPets.length > 0 ? (
                <select
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#D56756] focus:ring-2 focus:ring-[#D56756]/20"
                  required
                >
                  <option value="">Chọn thú cưng</option>
                  {ownerPets.map((pet) => (
                    <option key={pet.id} value={pet.name}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nhập tên thú cưng"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!selectedOwner}
                  required
                />
              )}
              <FieldError
                errors={
                  formik.touched.name && formik.errors.name
                    ? [{ message: formik.errors.name }]
                    : undefined
                }
              />
              {!selectedOwner ? (
                <FieldDescription className="text-sm text-slate-500">
                  Vui lòng chọn chủ thú cưng trước khi điền tên.
                </FieldDescription>
              ) : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="species">Loài thú cưng *</FieldLabel>
              <div className="flex gap-3">
                <Input
                  id="species"
                  name="species"
                  type="text"
                  placeholder="VD: Chó, Mèo, Chim..."
                  value={formik.values.species}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  list="species-list"
                  required
                  disabled={!selectedOwner}
                />
                <datalist id="species-list">
                  <option value="Chó" />
                  <option value="Mèo" />
                  <option value="Chim" />
                  <option value="Chuột" />
                  <option value="Thỏ" />
                  <option value="Khác" />
                </datalist>
              </div>
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
                disabled={!selectedOwner}
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
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!selectedOwner}
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

            {selectedOwner && ownerLoading ? (
              <FieldDescription className="text-sm text-slate-500">
                Đang tải thú cưng của chủ này...
              </FieldDescription>
            ) : null}

            {submitError ? (
              <FieldDescription className="text-center text-sm text-red-600">
                {submitError}
              </FieldDescription>
            ) : null}

            {submitSuccess ? (
              <FieldDescription className="text-center text-sm text-emerald-600">
                Thêm thú cưng thành công! Đang chuyển hướng...
              </FieldDescription>
            ) : null}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-full"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={loading || !selectedOwner}
                className="flex-1 rounded-full bg-[#D56756] px-5 py-3 text-base font-semibold text-white hover:bg-[#b34c47] disabled:cursor-not-allowed disabled:bg-[#d89992]"
              >
                {loading ? "Đang lưu..." : "Thêm thú cưng"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

export default ManagerPetCreatePage;
