import { CircleUser, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/lib/api.js";
import queryClient from "@/lib/queryClient";

const ProfileMenu = () => {
  const navigate = useNavigate();

  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear(); // Clear all cache
      navigate("/login", { replace: true });
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CircleUser size={35} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-full">
        <DropdownMenuGroup>
          <Link to="/profile">
            <DropdownMenuItem>
              <User />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/settings">
            <DropdownMenuItem>
              <Settings />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
