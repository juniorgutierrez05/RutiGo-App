import React, { useEffect, useState } from "react";
import { TopAppBar } from "../components/TopAppBar";
import { Button } from "../components/Button";
import { useApp } from "../store";
import { Place, Route } from "../types";
import * as api from "../services/api";

type Tab = "summary" | "users" | "places" | "routes";
const categories = ["cultura", "gastronomia", "naturaleza", "historia"];
const emptyPlace: api.PlaceInput = {
  name: "",
  description: "",
  category: "cultura",
  municipalityId: 0,
  latitude: "",
  longitude: "",
  address: "",
  schedule: "",
  estimatedTime: "",
  tag: "",
  priceNote: "",
  images: [],
};
const emptyRoute: api.RouteInput = {
  name: "",
  subtitle: "",
  description: "",
  category: "cultura",
  durationEstimate: "",
  distanceKm: 0,
  difficulty: "facil",
  coverImageUrl: "",
  priceSuggested: "",
  tips: "",
  placeIds: [],
  municipalityIds: [],
  highlights: [],
};

function inputClass() {
  return "w-full rounded-xl border border-[#E9DDD5] bg-[#FFFBF8] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20";
}
function placeToInput(place: Place): api.PlaceInput {
  return {
    name: place.name,
    description: place.description,
    category: place.category,
    municipalityId: 0,
    latitude: place.location.lat,
    longitude: place.location.lng,
    address: place.address,
    schedule: place.schedule,
    estimatedTime: place.estimatedTime,
    tag: place.tag,
    priceNote: place.priceNote,
    images: place.images.map((url) => ({ url })),
  };
}
function routeToInput(route: Route): api.RouteInput {
  return {
    name: route.name,
    subtitle: route.subtitle,
    description: route.description,
    category: route.category,
    durationEstimate: route.durationEstimate,
    distanceKm: route.distanceKm,
    difficulty:
      route.difficulty === "Fácil"
        ? "facil"
        : route.difficulty === "Avanzado"
          ? "avanzado"
          : "moderado",
    coverImageUrl: route.coverImageUrl,
    priceSuggested: route.priceSuggested,
    tips: route.tips,
    placeIds: route.placeIds.map(Number),
    municipalityIds: [],
    highlights: route.highlights || [],
  };
}

export const AdminScreen: React.FC = () => {
  const { currentUser, goBack, logout, navigateTo } = useApp();
  const [tab, setTab] = useState<Tab>("summary");
  const [users, setUsers] = useState<api.AdminUser[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [municipalities, setMunicipalities] = useState<api.Municipality[]>([]);
  const [placeForm, setPlaceForm] = useState<api.PlaceInput>(emptyPlace);
  const [routeForm, setRouteForm] = useState<api.RouteInput>(emptyRoute);
  const [editingPlace, setEditingPlace] = useState<number | null>(null);
  const [editingRoute, setEditingRoute] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [nextUsers, nextPlaces, nextRoutes, nextMunicipalities] =
        await Promise.all([
          api.getAdminUsers(),
          api.getPlaces(),
          api.getRoutes(),
          api.getMunicipalities(),
        ]);
      setUsers(nextUsers);
      setPlaces(nextPlaces);
      setRoutes(nextRoutes);
      setMunicipalities(nextMunicipalities);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "No se pudo cargar el panel";
      const normalizedError = errorMessage.toLowerCase();
      if (
        errorMessage.includes("401") ||
        normalizedError.includes("sesión") ||
        normalizedError.includes("autenticación")
      ) {
        await logout();
        navigateTo("login");
        return;
      }
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (currentUser?.role === "admin") void load();
  }, [currentUser]);

  if (currentUser?.role !== "admin")
    return (
      <div className="min-h-screen bg-background p-6 text-center">
        No tienes permisos para acceder al panel administrativo.
      </div>
    );

  const savePlace = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (placeForm.latitude === "" || placeForm.longitude === "") {
        setMessage("Ingresa latitud y longitud antes de guardar.");
        return;
      }
      const input = {
        ...placeForm,
        municipalityId: Number(placeForm.municipalityId),
        latitude: Number(placeForm.latitude),
        longitude: Number(placeForm.longitude),
      };
      if (editingPlace) await api.updatePlace(editingPlace, input);
      else await api.createPlace(input);
      setMessage("Lugar guardado correctamente");
      setPlaceForm(emptyPlace);
      setEditingPlace(null);
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo guardar el lugar",
      );
    }
  };
  const saveRoute = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const input = {
        ...routeForm,
        municipalityIds: routeForm.municipalityIds.map(Number),
        placeIds: routeForm.placeIds.map(Number),
        distanceKm: Number(routeForm.distanceKm),
      };
      if (editingRoute) await api.updateRoute(editingRoute, input);
      else await api.createRoute(input);
      setMessage("Ruta guardada correctamente");
      setRouteForm(emptyRoute);
      setEditingRoute(null);
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo guardar la ruta",
      );
    }
  };
  const toggleUser = async (user: api.AdminUser) => {
    try {
      if (user.status === "active")
        await api.blockUser(user.id, "Bloqueo desde panel administrativo");
      else await api.unblockUser(user.id);
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el usuario",
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-mesh-caribbean pb-10">
      <TopAppBar
        title="Panel administrativo"
        subtitle="Contenido y usuarios"
        showBack
        onBack={goBack}
        showNotifications={false}
      />
      <main className="px-4 pt-4 space-y-4">
        {message && (
          <div className="rounded-xl bg-white border border-primary/20 px-4 py-3 text-sm text-primary">
            {message}
          </div>
        )}
        <div className="grid grid-cols-4 gap-1 rounded-2xl bg-white p-1 shadow-sm">
          {(["summary", "users", "places", "routes"] as Tab[]).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-xl px-2 py-2 text-xs font-bold ${tab === item ? "bg-primary text-white" : "text-on-surface-variant"}`}
            >
              {item === "summary"
                ? "Resumen"
                : item === "users"
                  ? "Usuarios"
                  : item === "places"
                    ? "Lugares"
                    : "Rutas"}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center">
            Cargando datos reales...
          </div>
        ) : (
          <>
            {message &&
              users.length === 0 &&
              places.length === 0 &&
              routes.length === 0 && (
                <div className="rounded-2xl bg-white p-5 text-center">
                  <p className="text-sm text-red-700">
                    No se pudieron cargar las funciones administrativas.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => void load()}
                  >
                    Reintentar
                  </Button>
                </div>
              )}
            {tab === "summary" && (
              <section className="grid grid-cols-2 gap-3">
                {[
                  ["Usuarios", users.length, "group"],
                  ["Lugares", places.length, "location_on"],
                  ["Rutas", routes.length, "route"],
                  [
                    "Bloqueados",
                    users.filter((user) => user.status === "blocked").length,
                    "lock",
                  ],
                ].map(([label, value, icon]) => (
                  <div
                    key={String(label)}
                    className="clay-card rounded-2xl p-4"
                  >
                    <span className="material-symbols-outlined text-primary">
                      {icon}
                    </span>
                    <p className="mt-2 text-2xl font-black">{value}</p>
                    <p className="text-xs text-on-surface-variant">{label}</p>
                  </div>
                ))}
              </section>
            )}
            {tab === "users" && (
              <section className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="clay-card rounded-2xl p-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate">{user.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {user.email}
                      </p>
                      <span
                        className={`text-[11px] font-bold ${user.status === "active" ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {user.status === "active" ? "Activo" : "Bloqueado"} ·{" "}
                        {user.role}
                      </span>
                    </div>
                    {user.role !== "admin" && (
                      <Button
                        size="sm"
                        variant={
                          user.status === "active" ? "outline" : "secondary"
                        }
                        onClick={() => void toggleUser(user)}
                      >
                        {user.status === "active" ? "Bloquear" : "Desbloquear"}
                      </Button>
                    )}
                  </div>
                ))}
              </section>
            )}
            {tab === "places" && (
              <section className="space-y-4">
                <form
                  onSubmit={savePlace}
                  className="clay-card rounded-2xl p-4 space-y-3"
                >
                  <h2 className="font-bold">
                    {editingPlace ? "Editar lugar" : "Nuevo lugar"}
                  </h2>
                  <input
                    required
                    className={inputClass()}
                    placeholder="Nombre"
                    value={placeForm.name}
                    onChange={(event) =>
                      setPlaceForm({ ...placeForm, name: event.target.value })
                    }
                  />
                  <textarea
                    required
                    className={inputClass()}
                    placeholder="Descripción"
                    rows={3}
                    value={placeForm.description}
                    onChange={(event) =>
                      setPlaceForm({
                        ...placeForm,
                        description: event.target.value,
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className={inputClass()}
                      value={placeForm.category}
                      onChange={(event) =>
                        setPlaceForm({
                          ...placeForm,
                          category: event.target.value,
                        })
                      }
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                    <select
                      required
                      className={inputClass()}
                      value={placeForm.municipalityId || ""}
                      onChange={(event) =>
                        setPlaceForm({
                          ...placeForm,
                          municipalityId: Number(event.target.value),
                        })
                      }
                    >
                      <option value="">Municipio</option>
                      {municipalities.map((municipality) => (
                        <option key={municipality.id} value={municipality.id}>
                          {municipality.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs font-bold text-on-surface">
                      Latitud
                      <input
                        required
                        type="number"
                        step="any"
                        min="-90"
                        max="90"
                        className={inputClass()}
                        placeholder="Ej. 10.9876"
                        value={placeForm.latitude}
                        onChange={(event) =>
                          setPlaceForm({
                            ...placeForm,
                            latitude:
                              event.target.value === ""
                                ? ""
                                : Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="text-xs font-bold text-on-surface">
                      Longitud
                      <input
                        required
                        type="number"
                        step="any"
                        min="-180"
                        max="180"
                        className={inputClass()}
                        placeholder="Ej. -74.7889"
                        value={placeForm.longitude}
                        onChange={(event) =>
                          setPlaceForm({
                            ...placeForm,
                            longitude:
                              event.target.value === ""
                                ? ""
                                : Number(event.target.value),
                          })
                        }
                      />
                    </label>
                  </div>
                  <input
                    className={inputClass()}
                    placeholder="Dirección"
                    value={placeForm.address}
                    onChange={(event) =>
                      setPlaceForm({
                        ...placeForm,
                        address: event.target.value,
                      })
                    }
                  />
                  <input
                    className={inputClass()}
                    placeholder="Horario"
                    value={placeForm.schedule}
                    onChange={(event) =>
                      setPlaceForm({
                        ...placeForm,
                        schedule: event.target.value,
                      })
                    }
                  />
                  <div className="flex gap-2">
                    <input
                      className={inputClass()}
                      placeholder="URL de imagen"
                      value={imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (imageUrl)
                          setPlaceForm({
                            ...placeForm,
                            images: [...placeForm.images, { url: imageUrl }],
                          });
                        setImageUrl("");
                      }}
                    >
                      Agregar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {placeForm.images.map((image) => (
                      <span
                        key={image.url}
                        className="rounded-full bg-primary-fixed px-2 py-1 text-xs"
                      >
                        {image.url.slice(0, 24)}...
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Guardar lugar</Button>
                    {editingPlace && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingPlace(null);
                          setPlaceForm(emptyPlace);
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="clay-card rounded-2xl p-3 flex items-center gap-3"
                  >
                    <div className="h-14 w-14 rounded-xl overflow-hidden bg-surfaceContainerLow">
                      {place.images[0] && (
                        <img
                          src={place.images[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate">{place.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {place.municipality} · {place.category}
                      </p>
                    </div>
                    <button
                      aria-label="Editar lugar"
                      className="material-symbols-outlined text-primary"
                      onClick={() => {
                        setEditingPlace(Number(place.id));
                        setPlaceForm({
                          ...placeToInput(place),
                          municipalityId:
                            municipalities.find(
                              (municipality) =>
                                municipality.name === place.municipality,
                            )?.id || 0,
                        });
                      }}
                    >
                      edit
                    </button>
                    <button
                      aria-label="Eliminar lugar"
                      className="material-symbols-outlined text-red-600"
                      onClick={() =>
                        void api.deletePlace(Number(place.id)).then(load)
                      }
                    >
                      delete
                    </button>
                  </div>
                ))}
              </section>
            )}
            {tab === "routes" && (
              <section className="space-y-4">
                <form
                  onSubmit={saveRoute}
                  className="clay-card rounded-2xl p-4 space-y-3"
                >
                  <h2 className="font-bold">
                    {editingRoute ? "Editar ruta" : "Nueva ruta"}
                  </h2>
                  <input
                    required
                    className={inputClass()}
                    placeholder="Nombre"
                    value={routeForm.name}
                    onChange={(event) =>
                      setRouteForm({ ...routeForm, name: event.target.value })
                    }
                  />
                  <textarea
                    required
                    className={inputClass()}
                    placeholder="Descripción"
                    rows={3}
                    value={routeForm.description}
                    onChange={(event) =>
                      setRouteForm({
                        ...routeForm,
                        description: event.target.value,
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className={inputClass()}
                      value={routeForm.category}
                      onChange={(event) =>
                        setRouteForm({
                          ...routeForm,
                          category: event.target.value,
                        })
                      }
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                    <select
                      className={inputClass()}
                      value={routeForm.difficulty}
                      onChange={(event) =>
                        setRouteForm({
                          ...routeForm,
                          difficulty: event.target
                            .value as api.RouteInput["difficulty"],
                        })
                      }
                    >
                      <option value="facil">Fácil</option>
                      <option value="moderado">Moderado</option>
                      <option value="avanzado">Avanzado</option>
                    </select>
                  </div>
                  <input
                    className={inputClass()}
                    placeholder="URL de portada"
                    value={routeForm.coverImageUrl}
                    onChange={(event) =>
                      setRouteForm({
                        ...routeForm,
                        coverImageUrl: event.target.value,
                      })
                    }
                  />
                  <input
                    className={inputClass()}
                    placeholder="Duración estimada"
                    value={routeForm.durationEstimate}
                    onChange={(event) =>
                      setRouteForm({
                        ...routeForm,
                        durationEstimate: event.target.value,
                      })
                    }
                  />
                  <label className="block text-xs font-bold">Paradas</label>
                  <select
                    multiple
                    className={`${inputClass()} h-28`}
                    value={routeForm.placeIds.map(String)}
                    onChange={(event) =>
                      setRouteForm({
                        ...routeForm,
                        placeIds: Array.from(
                          event.target.selectedOptions,
                          (option) => Number(option.value),
                        ),
                      })
                    }
                  >
                    {places.map((place) => (
                      <option key={place.id} value={place.id}>
                        {place.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Button type="submit">Guardar ruta</Button>
                    {editingRoute && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingRoute(null);
                          setRouteForm(emptyRoute);
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className="clay-card rounded-2xl p-3 flex items-center gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate">{route.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {route.category} · {route.placeIds.length} paradas
                      </p>
                    </div>
                    <button
                      aria-label="Editar ruta"
                      className="material-symbols-outlined text-primary"
                      onClick={() => {
                        setEditingRoute(Number(route.id));
                        setRouteForm({
                          ...routeToInput(route),
                          municipalityIds: route.municipalities
                            .map(
                              (name) =>
                                municipalities.find(
                                  (municipality) => municipality.name === name,
                                )?.id,
                            )
                            .filter((id): id is number => Boolean(id)),
                        });
                      }}
                    >
                      edit
                    </button>
                    <button
                      aria-label="Eliminar ruta"
                      className="material-symbols-outlined text-red-600"
                      onClick={() =>
                        void api.deleteRoute(Number(route.id)).then(load)
                      }
                    >
                      delete
                    </button>
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};
