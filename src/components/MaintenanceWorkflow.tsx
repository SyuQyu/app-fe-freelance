'use client';

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  Wrench,
  Calendar,
  User,
  Truck,
  FileText,
  DollarSign,
  MapPin,
  Upload,
  X,
  Download,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";

interface MaintenanceRequest {
  id: string;
  vehicleId: string;
  plateNumber: string;
  vehicleType: "tanki" | "krp";
  type: string; // Changed to accept any string for free text input
  category:
    | "engine"
    | "transmission"
    | "brake"
    | "tire"
    | "electrical"
    | "body"
    | "ac"
    | "other";
  title: string;
  description: string;
  priority: "critical" | "non-critical" | "high" | "medium" | "low";
  requestedBy: string;
  requestDate: string;
  status:
    | "submitted"
    | "approved"
    | "rejected"
    | "planned"
    | "in-progress"
    | "completed";
  estimatedCost: number;
  actualCost?: number;
  dueDate?: string;
  assignedTo?: string;
  workshop?: string;
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  completedDate?: string;
  mileage: number;
  location?: string;
  maintenanceKm?: number;
  items?: Array<{
    item: string;
    qty: number;
    price: number;
    total: number;
  }>;
  completionPhotos?: string[];
}

interface WorkflowAlert {
  id: string;
  vehicleId: string;
  plateNumber: string;
  type:
    | "pending_approval"
    | "overdue_approval"
    | "overdue_completion"
    | "high_priority_request"
    | "budget_exceeded"
    | "workshop_capacity";
  message: string;
  priority: "critical" | "non-critical" | "high" | "medium" | "low";
  createdAt: string;
  acknowledged: boolean;
  relatedRequestId?: string;
}

interface MaintenanceWorkflowProps {
  vehicleType?: "tanki" | "krp";
}

export function MaintenanceWorkflow({
  vehicleType,
}: MaintenanceWorkflowProps = {}) {
  const [requests, setRequests] = useState<
    MaintenanceRequest[]
  >([
    {
      id: "1",
      vehicleId: "1",
      plateNumber: "B 9254 HT",
      vehicleType: "tanki",
      type: "preventive",
      category: "engine",
      title: "Service Rutin 10.000 km",
      description:
        "Ganti oli mesin, filter oli, filter udara, dan pengecekan komprehensif",
      priority: "non-critical",
      requestedBy: "Ahmad Subandi",
      requestDate: "2024-09-15",
      status: "submitted",
      estimatedCost: 850000,
      mileage: 125000,
    },
    {
      id: "2",
      vehicleId: "2",
      plateNumber: "B 9254 HO",
      vehicleType: "tanki",
      type: "corrective",
      category: "brake",
      title: "Perbaikan Sistem Rem",
      description:
        "Kanvas rem depan sudah tipis, perlu diganti segera",
      priority: "critical",
      requestedBy: "Budi Santoso",
      requestDate: "2024-09-10",
      status: "approved",
      estimatedCost: 1200000,
      mileage: 156000,
      approvedBy: "Supervisor Fleet",
      approvedDate: "2024-09-11",
      dueDate: "2024-09-20",
    },
    {
      id: "3",
      vehicleId: "3",
      plateNumber: "B 9254 HA",
      vehicleType: "tanki",
      type: "emergency",
      category: "transmission",
      title: "Kerusakan Transmisi",
      description:
        "Transmisi tidak dapat pindah gigi, perlu perbaikan darurat",
      priority: "critical",
      requestedBy: "Agus Wibowo",
      requestDate: "2024-09-08",
      status: "in-progress",
      estimatedCost: 5000000,
      actualCost: 4800000,
      mileage: 98000,
      assignedTo: "Team Transmisi",
      workshop: "Bengkel Specialist Transmisi",
    },
    {
      id: "4",
      vehicleId: "4",
      plateNumber: "B 9254 HE",
      vehicleType: "tanki",
      type: "preventive",
      category: "tire",
      title: "Rotasi Ban dan Balancing",
      description:
        "Maintenance rutin ban untuk memperpanjang umur pakai",
      priority: "non-critical",
      requestedBy: "Dedi Rahman",
      requestDate: "2024-09-05",
      status: "completed",
      estimatedCost: 300000,
      actualCost: 280000,
      mileage: 87500,
      completedDate: "2024-09-12",
    },
    {
      id: "5",
      vehicleId: "5",
      plateNumber: "R 1234 AB",
      vehicleType: "krp",
      type: "preventive",
      category: "engine",
      title: "Service Berkala 5.000 km",
      description:
        "Penggantian oli dan filter rutin untuk kendaraan KRP",
      priority: "non-critical",
      requestedBy: "Joko Santoso",
      requestDate: "2024-09-14",
      status: "submitted",
      estimatedCost: 750000,
      mileage: 45000,
    },
    {
      id: "6",
      vehicleId: "6",
      plateNumber: "H 5678 CD",
      vehicleType: "krp",
      type: "corrective",
      category: "electrical",
      title: "Perbaikan Sistem Kelistrikan",
      description: "Lampu indikator dashboard tidak menyala",
      priority: "non-critical",
      requestedBy: "Andi Wijaya",
      requestDate: "2024-09-12",
      status: "approved",
      estimatedCost: 600000,
      mileage: 32000,
      approvedBy: "Supervisor Fleet",
      approvedDate: "2024-09-13",
      dueDate: "2024-09-22",
    },
    {
      id: "7",
      vehicleId: "7",
      plateNumber: "R 9876 XY",
      vehicleType: "krp",
      type: "corrective",
      category: "ac",
      title: "Perbaikan AC Kendaraan",
      description:
        "AC tidak dingin, perlu pengecekan dan pengisian freon",
      priority: "non-critical",
      requestedBy: "Rudi Hartono",
      requestDate: "2024-09-11",
      status: "in-progress",
      estimatedCost: 450000,
      mileage: 28000,
      assignedTo: "Team AC",
      workshop: "Bengkel AC Specialist",
    },
    {
      id: "8",
      vehicleId: "8",
      plateNumber: "H 2468 EF",
      vehicleType: "krp",
      type: "preventive",
      category: "brake",
      title: "Pengecekan Sistem Rem",
      description:
        "Pemeriksaan rutin kondisi rem dan minyak rem",
      priority: "non-critical",
      requestedBy: "Bambang Susilo",
      requestDate: "2024-09-06",
      status: "completed",
      estimatedCost: 350000,
      actualCost: 320000,
      mileage: 41000,
      completedDate: "2024-09-13",
    },
  ]);

  const [workflowAlerts, setWorkflowAlerts] = useState<
    WorkflowAlert[]
  >([
    {
      id: "1",
      vehicleId: "1",
      plateNumber: "B 9254 HT",
      type: "pending_approval",
      message:
        "Pengajuan service rutin menunggu persetujuan lebih dari 3 hari",
      priority: "non-critical",
      createdAt: "2024-09-18",
      acknowledged: false,
      relatedRequestId: "1",
    },
    {
      id: "2",
      vehicleId: "3",
      plateNumber: "B 9254 HA",
      type: "high_priority_request",
      message:
        "Pengajuan maintenance darurat dengan prioritas kritis memerlukan tindakan segera",
      priority: "critical",
      createdAt: "2024-09-19",
      acknowledged: false,
      relatedRequestId: "3",
    },
    {
      id: "3",
      vehicleId: "2",
      plateNumber: "B 9254 HO",
      type: "overdue_completion",
      message:
        "Perbaikan sistem rem melebihi batas waktu yang ditentukan",
      priority: "critical",
      createdAt: "2024-09-19",
      acknowledged: false,
      relatedRequestId: "2",
    },
    {
      id: "4",
      vehicleId: "5",
      plateNumber: "B 9254 HU",
      type: "budget_exceeded",
      message:
        "Estimasi biaya maintenance melebihi budget yang disetujui",
      priority: "non-critical",
      createdAt: "2024-09-17",
      acknowledged: true,
    },
    {
      id: "5",
      vehicleId: "6",
      plateNumber: "B 9254 HR",
      type: "workshop_capacity",
      message:
        "Bengkel utama sudah mencapai kapasitas maksimum, pertimbangkan alternatif",
      priority: "non-critical",
      createdAt: "2024-09-16",
      acknowledged: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showRequestDialog, setShowRequestDialog] =
    useState(false);
  const [showDetailDialog, setShowDetailDialog] =
    useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [activeTab, setActiveTab] = useState("pengajuan");

  // New dialog states for approval workflows
  const [
    showPengajuanApprovalDialog,
    setShowPengajuanApprovalDialog,
  ] = useState(false);
  const [
    showRencanaApprovalDialog,
    setShowRencanaApprovalDialog,
  ] = useState(false);
  const [
    showPerawatanCompletionDialog,
    setShowPerawatanCompletionDialog,
  ] = useState(false);
  const [showBAPengajuanDialog, setShowBAPengajuanDialog] = useState(false);

  // Form states for approval workflows
  const [pengajuanApprovalForm, setPengajuanApprovalForm] =
    useState({
      location: "",
      vehicle: "",
      kmRencana: "",
      bengkel: "",
      keterangan: "",
      issue: "",
    });

  const [rencanaApprovalForm, setRencanaApprovalForm] =
    useState({
      kmPerawatan: "",
      items: [{ item: "", qty: "", price: "" }],
    });

  const [perawatanCompletionForm, setPerawatanCompletionForm] =
    useState({
      photos: [] as string[],
    });

  // Form state
  const [formData, setFormData] = useState({
    plateNumber: "",
    maintenanceName: "",
    mileage: "",
    requestDate: new Date().toISOString().split("T")[0],
    maintenanceType: "",
    category: "non-critical" as "critical" | "non-critical",
    issue: "",
    keterangan: "",
    photoIssues: [] as string[], // Changed to array for multiple photos (max 5)
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    plateNumber: "",
    maintenanceName: "",
    mileage: "",
    requestDate: "",
    maintenanceType: "",
    category: "non-critical" as "critical" | "non-critical",
    issue: "",
    keterangan: "",
    photoIssues: [] as string[], // Changed to array for multiple photos (max 5)
  });

  // Filter by vehicle type if specified
  const filteredByVehicleType = vehicleType
    ? requests.filter((r) => r.vehicleType === vehicleType)
    : requests;

  // Filter data based on status for each tab
  const pengajuanData = filteredByVehicleType.filter(
    (r) => r.status === "submitted",
  );
  const rencanaData = filteredByVehicleType.filter((r) =>
    ["approved", "planned"].includes(r.status),
  );
  const perawatanData = filteredByVehicleType.filter(
    (r) => r.status === "in-progress",
  );
  const selesaiData = filteredByVehicleType.filter(
    (r) => r.status === "completed",
  );

  // Page title and description based on vehicle type
  const pageTitle = vehicleType
    ? `Workflow Maintenance Mobil ${vehicleType === "tanki" ? "Tanki" : "KRP"}`
    : "Workflow Maintenance";

  const pageDescription = vehicleType
    ? `Kelola workflow maintenance untuk kendaraan ${vehicleType === "tanki" ? "tanki" : "KRP"}`
    : "Kelola proses maintenance dari pengajuan hingga selesai";

  // Filter unacknowledged alerts
  const unacknowledgedAlerts = workflowAlerts.filter(
    (alert) => !alert.acknowledged,
  );

  const acknowledgeAlert = (alertId: string) => {
    setWorkflowAlerts(
      workflowAlerts.map((alert) =>
        alert.id === alertId
          ? { ...alert, acknowledged: true }
          : alert,
      ),
    );
  };

  const handleViewDetail = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setShowDetailDialog(true);
  };

  // Handler for Pengajuan Approval with form
  const handleOpenPengajuanApproval = (
    request: MaintenanceRequest,
  ) => {
    setSelectedRequest(request);
    setPengajuanApprovalForm({
      location: "",
      vehicle: request.plateNumber,
      kmRencana: String(request.mileage),
      bengkel: "",
      keterangan: "",
      issue: request.description,
    });
    setShowPengajuanApprovalDialog(true);
  };

  const handlePengajuanApprovalSubmit = () => {
    if (
      !pengajuanApprovalForm.location ||
      !pengajuanApprovalForm.vehicle ||
      !pengajuanApprovalForm.kmRencana ||
      !pengajuanApprovalForm.bengkel
    ) {
      toast.error(
        "Mohon lengkapi semua field yang wajib diisi",
      );
      return;
    }

    if (!selectedRequest) return;

    setRequests(
      requests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "approved",
              approvedBy: "Supervisor Fleet",
              approvedDate: new Date()
                .toISOString()
                .split("T")[0],
              location: pengajuanApprovalForm.location,
              workshop: pengajuanApprovalForm.bengkel,
              notes: pengajuanApprovalForm.keterangan,
            }
          : req,
      ),
    );

    setShowPengajuanApprovalDialog(false);
    setActiveTab("rencana");
    toast.success("Pengajuan Disetujui!", {
      description:
        "Pengajuan maintenance telah disetujui dan dipindahkan ke tab Rencana",
    });
  };

  // Handler for Rencana Approval with items form
  const handleOpenRencanaApproval = (
    request: MaintenanceRequest,
  ) => {
    setSelectedRequest(request);
    setRencanaApprovalForm({
      kmPerawatan: String(request.mileage),
      items: [{ item: "", qty: "", price: "" }],
    });
    setShowRencanaApprovalDialog(true);
  };

  const handleAddItem = () => {
    setRencanaApprovalForm({
      ...rencanaApprovalForm,
      items: [
        ...rencanaApprovalForm.items,
        { item: "", qty: "", price: "" },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    setRencanaApprovalForm({
      ...rencanaApprovalForm,
      items: rencanaApprovalForm.items.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const handleItemChange = (
    index: number,
    field: "item" | "qty" | "price",
    value: string,
  ) => {
    const newItems = [...rencanaApprovalForm.items];
    newItems[index][field] = value;
    setRencanaApprovalForm({
      ...rencanaApprovalForm,
      items: newItems,
    });
  };

  const calculateTotalPrice = () => {
    return rencanaApprovalForm.items.reduce((sum, item) => {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + qty * price;
    }, 0);
  };

  const handleRencanaApprovalSubmit = () => {
    if (
      !rencanaApprovalForm.kmPerawatan ||
      rencanaApprovalForm.items.some(
        (item) => !item.item || !item.qty || !item.price,
      )
    ) {
      toast.error(
        "Mohon lengkapi semua field yang wajib diisi",
      );
      return;
    }

    if (!selectedRequest) return;

    const formattedItems = rencanaApprovalForm.items.map(
      (item) => ({
        item: item.item,
        qty: parseFloat(item.qty),
        price: parseFloat(item.price),
        total: parseFloat(item.qty) * parseFloat(item.price),
      }),
    );

    setRequests(
      requests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "in-progress",
              maintenanceKm: parseFloat(
                rencanaApprovalForm.kmPerawatan,
              ),
              items: formattedItems,
              actualCost: calculateTotalPrice(),
            }
          : req,
      ),
    );

    setShowRencanaApprovalDialog(false);
    setActiveTab("perawatan");
    toast.success("Rencana Disetujui!", {
      description:
        "Rencana maintenance telah disetujui dan dipindahkan ke tab Perawatan",
    });
  };

  // Handler for Perawatan Completion with photo upload
  const handleOpenPerawatanCompletion = (
    request: MaintenanceRequest,
  ) => {
    setSelectedRequest(request);
    setPerawatanCompletionForm({
      photos: [],
    });
    setShowPerawatanCompletionDialog(true);
  };

  const handleCompletionPhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.match("image.*")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPerawatanCompletionForm((prev) => ({
            ...prev,
            photos: [...prev.photos, base64String],
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveCompletionPhoto = (index: number) => {
    setPerawatanCompletionForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handlePerawatanCompletionSubmit = () => {
    if (perawatanCompletionForm.photos.length === 0) {
      toast.error(
        "Mohon upload minimal 1 foto selesai perawatan",
      );
      return;
    }

    if (!selectedRequest) return;

    setRequests(
      requests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "completed",
              completedDate: new Date()
                .toISOString()
                .split("T")[0],
              completionPhotos: perawatanCompletionForm.photos,
            }
          : req,
      ),
    );

    setShowPerawatanCompletionDialog(false);
    setActiveTab("selesai");
    toast.success("Perawatan Selesai!", {
      description:
        "Maintenance telah diselesaikan dan dipindahkan ke tab Selesai",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: "rejected" }
          : req,
      ),
    );
    setShowDetailDialog(false);
  };

  const handleEditRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setEditFormData({
      plateNumber: request.plateNumber,
      maintenanceName: request.title,
      mileage: String(request.mileage),
      requestDate: request.requestDate,
      maintenanceType: request.type,
      category:
        request.priority === "critical"
          ? "critical"
          : "non-critical",
      issue: request.description,
      keterangan: request.notes || "",
      photoIssues: [], // Reset to empty array
    });
    setShowEditDialog(true);
  };

  const handleUpdateRequest = () => {
    if (!selectedRequest) return;

    if (
      !editFormData.plateNumber ||
      !editFormData.maintenanceName ||
      !editFormData.mileage ||
      !editFormData.maintenanceType
    ) {
      toast.error(
        "Mohon lengkapi semua field yang wajib diisi",
        {
          description:
            "Nomor Polisi, Nama Perawatan, KM Tempuh, dan Jenis Perawatan harus diisi",
        },
      );
      return;
    }

    setRequests(
      requests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              plateNumber: editFormData.plateNumber,
              title: editFormData.maintenanceName,
              mileage: parseInt(editFormData.mileage),
              requestDate: editFormData.requestDate,
              type: editFormData.maintenanceType, // Now accepts free text
              priority: editFormData.category,
              description:
                editFormData.issue ||
                editFormData.keterangan ||
                "Tidak ada deskripsi",
              notes: editFormData.keterangan,
            }
          : req,
      ),
    );

    setShowEditDialog(false);
    toast.success("Data Berhasil Diupdate!", {
      description: "Pengajuan maintenance telah diperbarui",
    });
  };

  const handleSubmitNewRequest = () => {
    if (
      !formData.plateNumber ||
      !formData.maintenanceName ||
      !formData.mileage ||
      !formData.maintenanceType
    ) {
      toast.error(
        "Mohon lengkapi semua field yang wajib diisi",
        {
          description:
            "Nomor Polisi, Nama Perawatan, KM Tempuh, dan Jenis Perawatan harus diisi",
        },
      );
      return;
    }

    const newRequest: MaintenanceRequest = {
      id: String(requests.length + 1),
      vehicleId: String(requests.length + 1),
      plateNumber: formData.plateNumber,
      vehicleType: vehicleType || "tanki",
      type: formData.maintenanceType, // Now accepts free text
      category: "other",
      title: formData.maintenanceName,
      description:
        formData.issue ||
        formData.keterangan ||
        "Tidak ada deskripsi",
      priority: formData.category,
      requestedBy: "User",
      requestDate: formData.requestDate,
      status: "submitted",
      estimatedCost: 0,
      mileage: parseInt(formData.mileage),
      notes: formData.keterangan,
    };

    setRequests([...requests, newRequest]);

    // Reset form
    setFormData({
      plateNumber: "",
      maintenanceName: "",
      mileage: "",
      requestDate: new Date().toISOString().split("T")[0],
      maintenanceType: "",
      category: "non-critical",
      issue: "",
      keterangan: "",
      photoIssues: [],
    });

    setShowRequestDialog(false);
    setActiveTab("pengajuan"); // Switch to pengajuan tab to show the new request

    toast.success("Pengajuan Maintenance Berhasil!", {
      description: `Pengajuan untuk ${formData.plateNumber} - ${formData.maintenanceName} telah ditambahkan`,
    });
  };

  // Handler for multiple image upload (max 5 photos)
  const handleMultipleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false,
  ) => {
    const files = e.target.files;
    if (!files) return;

    const currentPhotos = isEdit
      ? editFormData.photoIssues
      : formData.photoIssues;

    // Check if adding new files would exceed the limit
    if (currentPhotos.length + files.length > 5) {
      toast.error("Maksimal 5 Foto", {
        description:
          "Anda hanya dapat mengupload maksimal 5 foto",
      });
      return;
    }

    // Convert files to base64
    Array.from(files).forEach((file) => {
      if (file.type.match("image.*")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          if (isEdit) {
            setEditFormData((prev) => ({
              ...prev,
              photoIssues: [...prev.photoIssues, base64String],
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              photoIssues: [...prev.photoIssues, base64String],
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Handler to remove a specific photo
  const handleRemovePhoto = (
    index: number,
    isEdit: boolean = false,
  ) => {
    if (isEdit) {
      setEditFormData((prev) => ({
        ...prev,
        photoIssues: prev.photoIssues.filter(
          (_, i) => i !== index,
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        photoIssues: prev.photoIssues.filter(
          (_, i) => i !== index,
        ),
      }));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: {
        label: "Diajukan",
        color: "bg-blue-100 text-blue-800",
      },
      approved: {
        label: "Disetujui",
        color: "bg-green-100 text-green-800",
      },
      rejected: {
        label: "Ditolak",
        color: "bg-red-100 text-red-800",
      },
      planned: {
        label: "Direncanakan",
        color: "bg-purple-100 text-purple-800",
      },
      "in-progress": {
        label: "Dikerjakan",
        color: "bg-yellow-100 text-yellow-800",
      },
      completed: {
        label: "Selesai",
        color: "bg-emerald-100 text-emerald-800",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.submitted;
    return (
      <Badge className={config.color}>{config.label}</Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      critical: {
        label: "Critical",
        color: "bg-red-500 text-white",
      },
      "non-critical": {
        label: "Non Critical",
        color: "bg-yellow-500 text-white",
      },
    };

    const config =
      priorityConfig[priority as keyof typeof priorityConfig] ||
      priorityConfig["non-critical"];
    return (
      <Badge className={config.color}>{config.label}</Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      engine: <Wrench className="w-4 h-4 text-blue-600" />,
      transmission: (
        <Wrench className="w-4 h-4 text-green-600" />
      ),
      brake: <AlertTriangle className="w-4 h-4 text-red-600" />,
      tire: <Truck className="w-4 h-4 text-yellow-600" />,
      electrical: (
        <Wrench className="w-4 h-4 text-purple-600" />
      ),
      body: <FileText className="w-4 h-4 text-gray-600" />,
      ac: <Wrench className="w-4 h-4 text-cyan-600" />,
      other: <Wrench className="w-4 h-4 text-gray-600" />,
    };
    return icons[category as keyof typeof icons] || icons.other;
  };

  const RequestCard = ({
    request,
  }: {
    request: MaintenanceRequest;
  }) => {
    const isPengajuan = request.status === "submitted";
    const isRencana = ["approved", "planned"].includes(
      request.status,
    );
    const isPerawatan = request.status === "in-progress";
    const isSelesai = request.status === "completed";

    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {getCategoryIcon(request.category)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {request.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {request.plateNumber} •{" "}
                  {request.mileage.toLocaleString()} km
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getPriorityBadge(request.priority)}
              {getStatusBadge(request.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-700 mb-4">
            {request.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Pemohon: {request.requestedBy}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Tanggal:{" "}
                {new Date(
                  request.requestDate,
                ).toLocaleDateString("id-ID")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Est. Biaya: Rp{" "}
                {request.estimatedCost.toLocaleString()}
              </span>
            </div>
            {request.workshop && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Bengkel: {request.workshop}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleViewDetail(request)}
            >
              <Eye className="w-4 h-4" />
              Detail
            </Button>

            {/* Pengajuan Tab Buttons */}
            {isPengajuan && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700"
                  onClick={() =>
                    handleOpenPengajuanApproval(request)
                  }
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleEditRequest(request)}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </>
            )}

            {/* Rencana Tab Buttons */}
            {isRencana && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowBAPengajuanDialog(true);
                  }}
                >
                  <FileText className="w-4 h-4" />
                  BA Pengajuan
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700"
                  onClick={() =>
                    handleOpenRencanaApproval(request)
                  }
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
              </>
            )}

            {/* Perawatan Tab Buttons */}
            {isPerawatan && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  SPK
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700"
                  onClick={() =>
                    handleOpenPerawatanCompletion(request)
                  }
                >
                  <CheckCircle className="w-4 h-4" />
                  Selesai Perawatan
                </Button>
              </>
            )}

            {/* Selesai Tab Buttons */}
            {isSelesai && (
              <>
                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Truck className="w-4 h-4" />
                  Serah Terima Kendaraan
                </Button>
                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileText className="w-4 h-4" />
                  BA Selesai Perawatan
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const DetailDialog = () => {
    if (!selectedRequest) return null;

    // Check if this is a submitted request (pengajuan tab view)
    const isSubmittedView =
      selectedRequest.status === "submitted";
    // Check if this is a planned/approved request (rencana tab view)
    const isPlannedView = ["approved", "planned"].includes(
      selectedRequest.status,
    );
    // Check if this is an in-progress maintenance (perawatan tab view)
    const isMaintenanceView =
      selectedRequest.status === "in-progress";
    // Check if completed
    const isCompletedView =
      selectedRequest.status === "completed";

    const detailItems =
      isPlannedView || isMaintenanceView || isCompletedView
        ? [
            { jenis: "Filter Oli", tipe: "" },
            { jenis: "Filter Udara (Berbahan)", tipe: "" },
            { jenis: "Fuel Filter", tipe: "" },
            { jenis: "Kerakikan", tipe: "" },
            { jenis: "Oli Mesin & Filter", tipe: "" },
            {
              jenis: "Pemeriksaan Instrumen Lainnya",
              tipe: "",
            },
          ]
        : [{ jenis: "Oli Mesin & Filter", tipe: "" }];

    // Enhanced Baik items for maintenance view
    const baikItems = isMaintenanceView
      ? [
          {
            nama: "Filter Oli",
            jumlah: 1,
            harga: 150000,
            total: 150000,
          },
          {
            nama: "Oli Mesin",
            jumlah: 4,
            harga: 75000,
            total: 300000,
          },
          {
            nama: "Filter Udara",
            jumlah: 1,
            harga: 120000,
            total: 120000,
          },
          {
            nama: "Busi",
            jumlah: 4,
            harga: 45000,
            total: 180000,
          },
          {
            nama: "Kampas Rem",
            jumlah: 2,
            harga: 250000,
            total: 500000,
          },
          {
            nama: "Lampu Rem",
            jumlah: 2,
            harga: 35000,
            total: 70000,
          },
        ]
      : [
          {
            nama: "Filter acak kawah (SUZU)",
            jumlah: 1,
            harga: 140000,
            total: 140000,
          },
        ];

    return (
      <Dialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isSubmittedView
                ? "Detail Pengajuan Maintenance"
                : "Detail Perawatan"}
            </DialogTitle>
          </DialogHeader>

          {isSubmittedView ? (
            /* Pengajuan View - Simplified view showing submission details */
            <div className="mt-6">
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nomor Polisi
                    </label>
                    <p className="text-gray-900 font-medium mt-1">
                      {selectedRequest.plateNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nama Perawatan
                    </label>
                    <p className="text-gray-900 font-medium mt-1">
                      {selectedRequest.title}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      KM Tempuh
                    </label>
                    <p className="text-gray-900 mt-1">
                      {selectedRequest.mileage.toLocaleString()}{" "}
                      km
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Tanggal Pengajuan
                    </label>
                    <p className="text-gray-900 mt-1">
                      {new Date(
                        selectedRequest.requestDate,
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Jenis Perawatan
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedRequest.type}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Issue / Keluhan
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedRequest.description || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Keterangan
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedRequest.notes || "-"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Rencana/Perawatan/Selesai View - Full detail view */
            <>
              <div className="grid grid-cols-2 gap-8 mt-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Kode
                      </label>
                      <p className="text-gray-900 font-medium">
                        00{selectedRequest.id}MAINTENANCE2025
                      </p>
                    </div>
                    {(isPlannedView || isMaintenanceView) && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          KM Realisasi
                        </label>
                        <p className="text-gray-900">
                          {selectedRequest.mileage.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nomor Polisi
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedRequest.plateNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Keterangan
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.notes ||
                          "ganti oli dan perbaikan lampu rem"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Suffix
                      </label>
                      <p className="text-gray-900">Suffix</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Issue / Keluhan
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.description ||
                          "lampu rem ada yang mati"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nama Perawatan
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.title}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Penangan
                      </label>
                      <p className="text-gray-900">
                        {isPlannedView || isMaintenanceView
                          ? "Internal"
                          : "Eksternal"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Tanggal Rencana
                      </label>
                      <p className="text-gray-900">
                        2025-07-23
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nama Bengkel
                      </label>
                      <p className="text-gray-900">
                        {isMaintenanceView
                          ? "Bengkel Specialist Transmisi"
                          : isPlannedView
                            ? "Daihatsu"
                            : selectedRequest.workshop ||
                              "(Belum Ditentukan)"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        KM Tempuh Rencana
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.mileage.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Alamat Bengkel
                      </label>
                      <p className="text-gray-900">
                        {isMaintenanceView
                          ? "Jl. Raya Industri No. 45"
                          : isPlannedView
                            ? "Jl.Daihatsu"
                            : "(Belum Ditentukan)"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Status Perawatan
                      </label>
                      <div className="mt-1">
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Tanggal Pengajuan
                    </label>
                    <p className="text-gray-900">
                      {new Date(
                        selectedRequest.requestDate,
                      ).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Right Column - Empty for layout balance */}
                <div></div>
              </div>
            </>
          )}

          {/* Detail Perawatan Table - Only for non-submitted requests */}
          {!isSubmittedView && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detail Perawatan
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">
                        #
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Jenis Perawatan
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Tipe Kegiatan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailItems.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100"
                      >
                        <td className="p-4 text-gray-700">
                          {index + 1}
                        </td>
                        <td className="p-4 text-gray-900">
                          {item.jenis}
                        </td>
                        <td className="p-4 text-gray-700">
                          {item.tipe}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Baik Section - Show for planned and maintenance view */}
          {(isPlannedView || isMaintenanceView) && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Baik
                </h3>
                {isMaintenanceView && (
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Add
                  </Button>
                )}
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">
                        #
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Nama Item
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Jumlah
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Harga per Item
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Total Harga
                      </th>
                      {isMaintenanceView && (
                        <th className="text-left p-4 font-medium text-gray-900">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {baikItems.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100"
                      >
                        <td className="p-4 text-gray-700">
                          {index + 1}
                        </td>
                        <td className="p-4 text-gray-900">
                          {item.nama}
                        </td>
                        <td className="p-4 text-gray-700">
                          {item.jumlah}
                        </td>
                        <td className="p-4 text-gray-700">
                          Rp. {item.harga.toLocaleString()}
                        </td>
                        <td className="p-4 text-gray-900">
                          Rp. {item.total.toLocaleString()}
                        </td>
                        {isMaintenanceView && (
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {isMaintenanceView && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-end">
                      <div className="text-lg font-semibold text-gray-900">
                        Total: Rp.{" "}
                        {baikItems
                          .reduce(
                            (sum, item) => sum + item.total,
                            0,
                          )
                          .toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Document Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isCompletedView
                ? "Document Result"
                : isMaintenanceView
                  ? "Document Upload"
                  : isPlannedView
                    ? "Document Result"
                    : "Document Issue"}
            </h3>

            {isCompletedView ? (
              <div className="space-y-4">
                {/* Multiple Document Images for Completed View */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <img
                      src="https://images.unsplash.com/photo-1734477127040-c5845f5af500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMHZlaGljbGUlMjBtYWludGVuYW5jZXxlbnwxfHx8fDE3NTgyNTMzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Before Maintenance"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-600 text-center">
                      Before Maintenance
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <img
                      src="https://images.unsplash.com/photo-1558618047-b06da56e0c1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTgyNTMzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="After Maintenance"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-600 text-center">
                      After Maintenance
                    </p>
                  </div>
                </div>

                {/* Additional Documents */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <img
                      src="https://images.unsplash.com/photo-1581091878206-03cc97b8e9c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTgyNTMzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Engine Check"
                      className="w-full h-20 object-cover rounded-lg mb-1"
                    />
                    <p className="text-xs text-gray-600 text-center">
                      Engine
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <img
                      src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTgyNTMzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Brake System"
                      className="w-full h-20 object-cover rounded-lg mb-1"
                    />
                    <p className="text-xs text-gray-600 text-center">
                      Brake
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <img
                      src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTgyNTMzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Oil Filter"
                      className="w-full h-20 object-cover rounded-lg mb-1"
                    />
                    <p className="text-xs text-gray-600 text-center">
                      Filter
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <img
                      src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTgyNTMzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Tools Used"
                      className="w-full h-20 object-cover rounded-lg mb-1"
                    />
                    <p className="text-xs text-gray-600 text-center">
                      Tools
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="flex flex-col items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1734477127040-c5845f5af500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTgyNTMzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Vehicle Documentation"
                    className="w-32 h-24 object-cover rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-600 mb-2">
                    {isMaintenanceView
                      ? "Truck.duck foto"
                      : isPlannedView
                        ? "ResultDownload"
                        : "VehicleDownload"}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Recommendation Result Section - Only for Completed */}
          {isCompletedView && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recommendation Result
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Maintenance Summary
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Perawatan telah diselesaikan dengan baik.
                      Semua komponen yang telah diperbaiki
                      berfungsi normal. Oil filter telah
                      diganti, oli mesin sudah diganti dengan
                      spesifikasi yang sesuai, dan sistem rem
                      telah diperbaiki dan diuji dengan hasil
                      memuaskan.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Recommendations
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>
                        • Service berikutnya dijadwalkan dalam 3
                        bulan atau 10.000 km
                      </li>
                      <li>
                        • Monitor kondisi rem setiap 1000 km
                        untuk memastikan performa optimal
                      </li>
                      <li>
                        • Periksa tekanan ban secara berkala
                        untuk efisiensi bahan bakar
                      </li>
                      <li>
                        • Gunakan spare parts original untuk
                        menjaga kualitas kendaraan
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Next Maintenance Schedule
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Tanggal:</strong> 2025-12-23 |{" "}
                        <strong>KM:</strong> 108.000 |{" "}
                        <strong>Jenis:</strong> Service Rutin
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  const EditRequestForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="editPlateNumber">
              Nomor Polisi
            </Label>
            <Input
              id="editPlateNumber"
              placeholder="B 1234 XYZ"
              value={editFormData.plateNumber}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  plateNumber: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="editMaintenanceName">
              Nama Perawatan
            </Label>
            <Input
              id="editMaintenanceName"
              placeholder="Contoh: Service Rutin 10.000 km"
              value={editFormData.maintenanceName}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  maintenanceName: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="editMileage">KM Tempuh</Label>
            <Input
              id="editMileage"
              type="number"
              placeholder="125000"
              value={editFormData.mileage}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  mileage: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="editRequestDate">
              Tanggal Pengajuan
            </Label>
            <Input
              id="editRequestDate"
              type="date"
              value={editFormData.requestDate}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  requestDate: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="editMaintenanceType">
            Jenis Perawatan
          </Label>
          <Input
            id="editMaintenanceType"
            placeholder="Contoh: Preventif, Korektif, Darurat"
            value={editFormData.maintenanceType}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                maintenanceType: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="editCategory">
            Kategori Maintenance
          </Label>
          <Select
            value={editFormData.category}
            onValueChange={(
              value: "critical" | "non-critical",
            ) =>
              setEditFormData({
                ...editFormData,
                category: value,
              })
            }
          >
            <SelectTrigger id="editCategory">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="non-critical">
                Non Critical
              </SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="editIssue">Issue / Keluhan</Label>
          <Textarea
            id="editIssue"
            placeholder="Jelaskan masalah atau keluhan yang dialami..."
            rows={3}
            value={editFormData.issue}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                issue: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="editKeterangan">Keterangan</Label>
          <Textarea
            id="editKeterangan"
            placeholder="Tambahkan keterangan tambahan jika diperlukan..."
            rows={3}
            value={editFormData.keterangan}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                keterangan: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="editPhotoIssue">
            Foto issue terkait (Max 5 foto)
          </Label>
          <div className="mt-2 space-y-3">
            {/* Display uploaded photos */}
            {editFormData.photoIssues.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {editFormData.photoIssues.map(
                  (photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Issue ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          handleRemovePhoto(index, true)
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        {index + 1}/5
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {/* Upload button - only show if less than 5 photos */}
            {editFormData.photoIssues.length < 5 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">
                  Upload foto
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {editFormData.photoIssues.length}/5 foto telah
                  diupload
                </p>
                <Input
                  id="editPhotoIssue"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={(e) =>
                    handleMultipleImageUpload(e, true)
                  }
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document
                      .getElementById("editPhotoIssue")
                      ?.click()
                  }
                >
                  Pilih Foto (PNG/JPG)
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowEditDialog(false)}
          >
            Batal
          </Button>
          <Button onClick={handleUpdateRequest}>
            Update Pengajuan
          </Button>
        </div>
      </div>
    );
  };

  const BAPengajuanDialog = () => {
    if (!selectedRequest) return null;

    const currentDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const getTodayFormatted = () => {
      const today = new Date();
      const day = today.toLocaleDateString('id-ID', { weekday: 'long' });
      const date = today.getDate();
      const month = today.toLocaleDateString('id-ID', { month: 'long' });
      const year = today.getFullYear();
      const time = today.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      return `${day}, tanggal ${date} bulan ${month} tahun ${year} pukul ${time} WIB`;
    };

    const totalWithPPN = selectedRequest.estimatedCost * 1.11;

    return (
      <Dialog open={showBAPengajuanDialog} onOpenChange={setShowBAPengajuanDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Berita Acara Pengajuan</DialogTitle>
          </DialogHeader>

          {/* BA Content - Print Area */}
          <div id="ba-pengajuan-content" className="bg-white p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="font-bold text-lg uppercase">BERITA ACARA</h2>
              <h3 className="font-bold text-lg uppercase">
                PERGANTIAN {selectedRequest.title.toUpperCase()}
              </h3>
            </div>

            {/* Opening Paragraph */}
            <div className="text-justify leading-relaxed">
              <p>
                Pada hari {getTodayFormatted()} bertempat di {selectedRequest.location || 'Fuel Terminal Malang'} telah dilakukan Pengecekan {selectedRequest.title} Pada Unit, sbb:
              </p>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-2">
              <div className="grid grid-cols-[200px_20px_1fr] gap-2">
                <div>Nomor Polisi</div>
                <div>:</div>
                <div className="font-medium">{selectedRequest.plateNumber}</div>
              </div>
              <div className="grid grid-cols-[200px_20px_1fr] gap-2">
                <div>Merek/Tipe Kendaraan</div>
                <div>:</div>
                <div className="font-medium">{selectedRequest.vehicleType === 'tanki' ? 'Hino 500 Tronton' : 'Toyota Fortuner'}</div>
              </div>
              <div className="grid grid-cols-[200px_20px_1fr] gap-2">
                <div>Kapasitas</div>
                <div>:</div>
                <div className="font-medium">{selectedRequest.vehicleType === 'tanki' ? '16.000 liter' : '7 Seats'}</div>
              </div>
              <div className="grid grid-cols-[200px_20px_1fr] gap-2">
                <div>{selectedRequest.title}</div>
                <div>:</div>
                <div className="font-medium">{selectedRequest.description}</div>
              </div>
            </div>

            {/* Estimated Cost */}
            <div className="space-y-2">
              <div className="grid grid-cols-[200px_20px_1fr] gap-2">
                <div>Dengan Estimasi Biaya</div>
                <div>:</div>
                <div className="font-medium">
                  Rp. {selectedRequest.estimatedCost.toLocaleString('id-ID')} (Sudah Termasuk Ppn 11%)
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="text-justify leading-relaxed">
              <p>
                Kami berharap {selectedRequest.title.toLowerCase()} yang sudah aus segera di Ganti. Adapun estimasi biaya telah Kami cantumkan
              </p>
            </div>

            {/* Closing Statement */}
            <div className="text-justify leading-relaxed">
              <p>Demikian Berita Acara ini dibuat sebenar-benarnya</p>
            </div>

            {/* Signature Section */}
            <div className="mt-12 pt-8">
              <div className="text-center mb-8">
                <p>Malang, {currentDate}</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Left Signature */}
                <div className="text-left space-y-20">
                  <div>
                    <p>Yang mengajukan,</p>
                  </div>
                  <div>
                    <div className="border-b border-gray-800 w-48 mb-1"></div>
                    <p className="font-medium underline">{selectedRequest.requestedBy}</p>
                    <p className="text-sm">Spv. Site FT Malang</p>
                  </div>
                </div>

                {/* Right Signature */}
                <div className="text-right space-y-20">
                  <div>
                    <p>Menyetujui,</p>
                  </div>
                  <div className="inline-block text-left">
                    <div className="border-b border-gray-800 w-48 mb-1"></div>
                    <p className="font-medium underline">{selectedRequest.approvedBy || 'Wawan Irawan'}</p>
                    <p className="text-sm">Officer Controlling & Evaluation Own Fleet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowBAPengajuanDialog(false)}>
              Tutup
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => {
                window.print();
              }}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const NewRequestForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="plateNumber">Nomor Polisi</Label>
            <Input
              id="plateNumber"
              placeholder="B 1234 XYZ"
              value={formData.plateNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  plateNumber: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="maintenanceName">
              Nama Perawatan
            </Label>
            <Input
              id="maintenanceName"
              placeholder="Contoh: Service Rutin 10.000 km"
              value={formData.maintenanceName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maintenanceName: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mileage">KM Tempuh</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="125000"
              value={formData.mileage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mileage: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="requestDate">
              Tanggal Pengajuan
            </Label>
            <Input
              id="requestDate"
              type="date"
              value={formData.requestDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requestDate: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="maintenanceType">
            Jenis Perawatan
          </Label>
          <Input
            id="maintenanceType"
            placeholder="Contoh: Preventif, Korektif, Darurat"
            value={formData.maintenanceType}
            onChange={(e) =>
              setFormData({
                ...formData,
                maintenanceType: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="category">Kategori Maintenance</Label>
          <Select
            value={formData.category}
            onValueChange={(
              value: "critical" | "non-critical",
            ) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="non-critical">
                Non Critical
              </SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="issue">Issue / Keluhan</Label>
          <Textarea
            id="issue"
            placeholder="Jelaskan masalah atau keluhan yang dialami..."
            rows={3}
            value={formData.issue}
            onChange={(e) =>
              setFormData({
                ...formData,
                issue: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="keterangan">Keterangan</Label>
          <Textarea
            id="keterangan"
            placeholder="Tambahkan keterangan tambahan jika diperlukan..."
            rows={3}
            value={formData.keterangan}
            onChange={(e) =>
              setFormData({
                ...formData,
                keterangan: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="photoIssue">
            Foto issue terkait (Max 5 foto)
          </Label>
          <div className="mt-2 space-y-3">
            {/* Display uploaded photos */}
            {formData.photoIssues.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.photoIssues.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Issue ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        handleRemovePhoto(index, false)
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                      {index + 1}/5
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button - only show if less than 5 photos */}
            {formData.photoIssues.length < 5 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">
                  Upload foto
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {formData.photoIssues.length}/5 foto telah
                  diupload
                </p>
                <Input
                  id="photoIssue"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={(e) =>
                    handleMultipleImageUpload(e, false)
                  }
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document
                      .getElementById("photoIssue")
                      ?.click()
                  }
                >
                  Pilih Foto (PNG/JPG)
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowRequestDialog(false)}
          >
            Batal
          </Button>
          <Button onClick={handleSubmitNewRequest}>
            Ajukan Maintenance
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {pageTitle}
        </h1>
        <p className="text-gray-600 mt-1">{pageDescription}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {pengajuanData.length}
                </div>
                <div className="text-sm text-gray-600">
                  Pengajuan
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {rencanaData.length}
                </div>
                <div className="text-sm text-gray-600">
                  Rencana
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {perawatanData.length}
                </div>
                <div className="text-sm text-gray-600">
                  Perawatan
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {selesaiData.length}
                </div>
                <div className="text-sm text-gray-600">
                  Selesai
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Alerts Section */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">
              Alert Workflow Maintenance
            </h3>
            <Badge className="bg-orange-100 text-orange-800 ml-2">
              {unacknowledgedAlerts.length} baru
            </Badge>
          </div>
          <div className="space-y-3">
            {unacknowledgedAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between bg-white p-4 rounded-lg border border-orange-100"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                      alert.priority === "critical"
                        ? "bg-red-500"
                        : alert.priority === "high"
                          ? "bg-orange-500"
                          : alert.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {alert.plateNumber}
                      </span>
                      <Badge
                        className={`text-xs ${
                          alert.priority === "critical"
                            ? "bg-red-100 text-red-800"
                            : alert.priority === "high"
                              ? "bg-orange-100 text-orange-800"
                              : alert.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {alert.priority === "critical"
                          ? "Critical"
                          : alert.priority === "high"
                            ? "Tinggi"
                            : alert.priority === "medium"
                              ? "Sedang"
                              : "Non Critical"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {new Date(
                          alert.createdAt,
                        ).toLocaleDateString("id-ID")}
                      </span>
                      <span>•</span>
                      <span className="capitalize">
                        {alert.type
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) =>
                            l.toUpperCase(),
                          )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {alert.relatedRequestId && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8"
                    >
                      Lihat Detail
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="text-xs h-8"
                  >
                    Tandai Selesai
                  </Button>
                </div>
              </div>
            ))}
            {unacknowledgedAlerts.length > 4 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm">
                  Lihat Semua Alert (
                  {unacknowledgedAlerts.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari nomor polisi, judul, atau pemohon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Dialog
            open={showRequestDialog}
            onOpenChange={setShowRequestDialog}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Ajukan Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Pengajuan Maintenance Baru
                </DialogTitle>
              </DialogHeader>
              <NewRequestForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="pengajuan"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Pengajuan ({pengajuanData.length})
          </TabsTrigger>
          <TabsTrigger
            value="rencana"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Rencana ({rencanaData.length})
          </TabsTrigger>
          <TabsTrigger
            value="perawatan"
            className="flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            Perawatan ({perawatanData.length})
          </TabsTrigger>
          <TabsTrigger
            value="selesai"
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Selesai ({selesaiData.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pengajuan" className="mt-6">
          <div className="space-y-4">
            {pengajuanData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  Tidak ada pengajuan baru
                </h3>
                <p>
                  Semua pengajuan maintenance telah diproses
                  atau belum ada pengajuan baru.
                </p>
              </div>
            ) : (
              pengajuanData.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rencana" className="mt-6">
          <div className="space-y-4">
            {rencanaData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  Tidak ada rencana maintenance
                </h3>
                <p>
                  Belum ada maintenance yang disetujui dan
                  dijadwalkan.
                </p>
              </div>
            ) : (
              rencanaData.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="perawatan" className="mt-6">
          <div className="space-y-4">
            {perawatanData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  Tidak ada maintenance aktif
                </h3>
                <p>
                  Saat ini tidak ada maintenance yang sedang
                  dikerjakan.
                </p>
              </div>
            ) : (
              perawatanData.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="selesai" className="mt-6">
          <div className="space-y-4">
            {selesaiData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  Belum ada maintenance selesai
                </h3>
                <p>
                  Belum ada maintenance yang telah diselesaikan.
                </p>
              </div>
            ) : (
              selesaiData.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <DetailDialog />

      {/* BA Pengajuan Dialog */}
      <BAPengajuanDialog />

      {/* Edit Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Pengajuan Maintenance
            </DialogTitle>
          </DialogHeader>
          <EditRequestForm />
        </DialogContent>
      </Dialog>

      {/* Pengajuan Approval Dialog */}
      <Dialog
        open={showPengajuanApprovalDialog}
        onOpenChange={setShowPengajuanApprovalDialog}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Approve Pengajuan Maintenance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="approvalLocation">
                Pilih Lokasi IT/FT *
              </Label>
              <Select
                value={pengajuanApprovalForm.location}
                onValueChange={(value) =>
                  setPengajuanApprovalForm({
                    ...pengajuanApprovalForm,
                    location: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="FT">FT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="approvalVehicle">Vehicle *</Label>
              <Input
                id="approvalVehicle"
                placeholder="Nomor Polisi"
                value={pengajuanApprovalForm.vehicle}
                onChange={(e) =>
                  setPengajuanApprovalForm({
                    ...pengajuanApprovalForm,
                    vehicle: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="approvalKmRencana">
                KM Tempuh Rencana *
              </Label>
              <Input
                id="approvalKmRencana"
                type="number"
                placeholder="KM Tempuh"
                value={pengajuanApprovalForm.kmRencana}
                onChange={(e) =>
                  setPengajuanApprovalForm({
                    ...pengajuanApprovalForm,
                    kmRencana: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="approvalBengkel">
                Nama Bengkel *
              </Label>
              <Input
                id="approvalBengkel"
                placeholder="Nama bengkel"
                value={pengajuanApprovalForm.bengkel}
                onChange={(e) =>
                  setPengajuanApprovalForm({
                    ...pengajuanApprovalForm,
                    bengkel: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="approvalKeterangan">
                Keterangan
              </Label>
              <Textarea
                id="approvalKeterangan"
                placeholder="Keterangan tambahan"
                rows={3}
                value={pengajuanApprovalForm.keterangan}
                onChange={(e) =>
                  setPengajuanApprovalForm({
                    ...pengajuanApprovalForm,
                    keterangan: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="approvalIssue">
                Issue / Keluhan
              </Label>
              <Textarea
                id="approvalIssue"
                placeholder="Issue atau keluhan"
                rows={3}
                value={pengajuanApprovalForm.issue}
                onChange={(e) =>
                  setPengajuanApprovalForm({
                    ...pengajuanApprovalForm,
                    issue: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setShowPengajuanApprovalDialog(false)
                }
              >
                Batal
              </Button>
              <Button onClick={handlePengajuanApprovalSubmit}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rencana Approval Dialog */}
      <Dialog
        open={showRencanaApprovalDialog}
        onOpenChange={setShowRencanaApprovalDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Approve Rencana Maintenance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="rencanaKmPerawatan">
                KM Perawatan *
              </Label>
              <Input
                id="rencanaKmPerawatan"
                type="number"
                placeholder="KM Perawatan"
                value={rencanaApprovalForm.kmPerawatan}
                onChange={(e) =>
                  setRencanaApprovalForm({
                    ...rencanaApprovalForm,
                    kmPerawatan: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Item Perawatan *</Label>
              <div className="space-y-3 mt-2">
                {rencanaApprovalForm.items.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-3 items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="col-span-5">
                        <Input
                          placeholder="Nama item"
                          value={item.item}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "item",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.qty}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "qty",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "price",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Rp{" "}
                          {(
                            (parseFloat(item.qty) || 0) *
                            (parseFloat(item.price) || 0)
                          ).toLocaleString()}
                        </span>
                        {rencanaApprovalForm.items.length >
                          1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() =>
                              handleRemoveItem(index)
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleAddItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Item
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">
                  Total Price:
                </span>
                <span className="text-xl font-bold text-blue-600">
                  Rp {calculateTotalPrice().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setShowRencanaApprovalDialog(false)
                }
              >
                Batal
              </Button>
              <Button onClick={handleRencanaApprovalSubmit}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Perawatan Completion Dialog */}
      <Dialog
        open={showPerawatanCompletionDialog}
        onOpenChange={setShowPerawatanCompletionDialog}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Selesai Perawatan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Upload Foto Selesai Perawatan *</Label>
              <div className="mt-2 space-y-3">
                {perawatanCompletionForm.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {perawatanCompletionForm.photos.map(
                      (photo, index) => (
                        <div
                          key={index}
                          className="relative group"
                        >
                          <img
                            src={photo}
                            alt={`Completion ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() =>
                              handleRemoveCompletionPhoto(index)
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-1">
                    Upload foto selesai perawatan
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {perawatanCompletionForm.photos.length} foto
                    telah diupload
                  </p>
                  <Input
                    id="completionPhoto"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    onChange={handleCompletionPhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document
                        .getElementById("completionPhoto")
                        ?.click()
                    }
                  >
                    Pilih Foto (PNG/JPG)
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setShowPerawatanCompletionDialog(false)
                }
              >
                Batal
              </Button>
              <Button onClick={handlePerawatanCompletionSubmit}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
